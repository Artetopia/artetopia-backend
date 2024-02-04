const createError = require("http-errors");
const multer = require("multer");
const aws = require("aws-sdk");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const s3Service = require("../lib/s3Service");

const Craftman = require("../models/craftsman.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Multimedia = require("../models/multimedia.model");

async function createProduct(userId, productObject) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const ObjectUser = new mongoose.Types.ObjectId(userId);
  const craftman = await Craftman.findOne({ user: ObjectUser });
  if (!craftman) {
    throw new createError(404, "Craftman no encontrado");
  }

  const images = productObject.images.map((image) => {
    const [, mime, data] = /^data:(image\/\w+);base64,(.+)$/.exec(image) || [];
    if (!mime || !data) {
      throw new createError(500, "Invalid base64 data format");
    }

    const extension = mime.split("/")[1] || "jpg"; // Default to 'jpg' if extension is not found
    const imageBuffer = Buffer.from(data, "base64");

    return { buffer: imageBuffer, extension };
  });

  const results = await s3Service.s3UploadMultiple(images);

  const resultsSaveImages = await Promise.all(
    results.map(async (image) => {
      const objectMultimedia = {
        url: image.Location,
        key: image.key,
      };
      const saveImage = await Multimedia.create(objectMultimedia);
      if (!saveImage) {
        throw new createError(400, "Error al crear las imágenes");
      }
      return saveImage._id;
    })
  );

  productObject.images = resultsSaveImages;
  productObject.craftsman = craftman._id;
  const newProduct = await Product.create(productObject);

  if (!newProduct) {
    throw new createError(400, "Error al crear el producto");
  }

  const updateProductsCraftman = await Craftman.findByIdAndUpdate(
    craftman._id,
    { $push: { productsId: newProduct._id } }
  );

  if (!updateProductsCraftman) {
    throw new createError(
      400,
      "Error al actualizar los productos en el artesano"
    );
  }
  return newProduct;
}

async function updateProduct(productId, productObject) {
  if (!mongoose.isValidObjectId(productId)) {
    throw new createError(400, "Id invalido");
  }

  const productExist = await Product.findById(productId);

  if (!productExist) {
    throw new createError(404, "El producto no existe");
  }

  //Eliminar todas las imagenes que no esten dentro de la base
  const ObjectIdImagesString = productExist.images.map((image) => {
    return image.toString();
  });

  const uniqueValues = ObjectIdImagesString.filter(
    (value) => !productObject.images.includes(value)
  );

  if (uniqueValues.length > 0) {
    const images = await Promise.all(
      uniqueValues.map(async (image) => {
        const objectIdMultimedia = new mongoose.Types.ObjectId(image);
        const multimedia = await Multimedia.findById(objectIdMultimedia);
        const deletedFile = await s3Service.s3DeleteFile(multimedia);
        if (deletedFile) {
          const productUpdated = await Product.findByIdAndUpdate(productId, {
            $pull: { images: multimedia._id },
          });
          if (productUpdated) {
            const deleteMultimedia = await Multimedia.findByIdAndDelete(
              multimedia._id
            );
            if (!deleteMultimedia) {
              throw new createError(400, "Error al eliminar la imagen");
            }
          }
        }
      })
    );
  }

  //subir todas las imagenes que hacen falta por subir a S3 y asginarlas a multimedia y al producto

  const newImages = productObject.newImages.map((image) => {
    const [, mime, data] = /^data:(image\/\w+);base64,(.+)$/.exec(image) || [];
    if (!mime || !data) {
      throw new createError(500, "Invalid base64 data format");
    }

    const extension = mime.split("/")[1] || "jpg"; // Default to 'jpg' if extension is not found
    const imageBuffer = Buffer.from(data, "base64");

    return { buffer: imageBuffer, extension };
  });

  const results = await s3Service.s3UploadMultiple(newImages);

  const resultsSaveImages = await Promise.all(
    results.map(async (image) => {
      const objectMultimedia = {
        url: image.Location,
        key: image.key,
      };
      const saveImage = await Multimedia.create(objectMultimedia);
      if (!saveImage) {
        throw new createError(400, "Error al crear las imágenes");
      }
      return saveImage._id;
    })
  );

  //Actualizar producto

  productObject.images = resultsSaveImages;

  const productUpdated = await Product.findByIdAndUpdate(
    productId,
    { $push: { images: productObject.images } },
    { new: true }
  ).populate({ path: "images", select: "url key" });

  if (!productUpdated) {
    throw new createError(400, "Error al actualizar el producto");
  }

  return productUpdated;
}

async function deleteProduct(productId) {
  console.log("productId", productId);
  if (!mongoose.isValidObjectId(productId)) {
    throw new createError(400, "Id invalido");
  }

  const productExist = await Product.findById(productId);

  if (!productExist) {
    throw new createError(404, "El producto no existe");
  }

  const images = await Promise.all(
    productExist.images.map(async (image) => {
      const objectIdMultimedia = new mongoose.Types.ObjectId(image);
      const multimedia = await Multimedia.findById(objectIdMultimedia);
      if (!multimedia) {
        throw new createError(400, "No se encontro una imagen");
      }
      const deletedFile = await s3Service.s3DeleteFile(multimedia);
      if (deletedFile) {
        const productUpdated = await Product.findByIdAndUpdate(
          productExist._id,
          { $pull: { images: multimedia._id } }
        );
        if (productUpdated) {
          const deleteMultimedia = await Multimedia.findByIdAndDelete(
            multimedia._id
          );
          if (!deleteMultimedia) {
            throw new createError(400, "Error al eliminar la imagen");
          }
        }
      }
    })
  );

  const product = await Product.findById(productId);
  if (product.images.length > 0) {
    throw new createError(
      400,
      "El producto no se puede eliminar, ya que cuenta imagenes existentes"
    );
  }

  constProductDeleted = await Product.findByIdAndDelete(productId);
  return constProductDeleted;
}

async function getAllProductsByCraftman(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const craftmanObject = new mongoose.Types.ObjectId(userId);
  const getCraftman = await Craftman.findOne({ user: craftmanObject });
  if (!getCraftman) {
    throw new createError(404, "Craftman no encontrado");
  }

  const products = await Product.find({
    craftsman: new mongoose.Types.ObjectId(getCraftman._id),
  }).populate({ path: "images", select: "url key" });

  return products;
}

async function getBankInformation(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const craftmanObject = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(craftmanObject);

  if (!user) {
    throw new createError(404, "Usuario no encontrado");
  }

  const craftman = await Craftman.findOne({ user: craftmanObject });

  if (!craftman) {
    throw new createError(404, "Craftman no encontrado");
  }

  if (!craftman.accountIdStripe) {
    const accountService = await stripe.accounts.create({
      type: "express",
      country: "MX",
      email: user.email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });

    const craftmanUpdated = await Craftman.findByIdAndUpdate(craftman._id, {
      accountIdStripe: accountService.id,
    });
    if (!craftmanUpdated) {
      throw new createError(400, "Error al actualizar el artesano");
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountService.id,
      refresh_url: "http://localhost:5173/",
      return_url: "http://localhost:5173/",
      type: "account_onboarding",
    });

    return {
      object: accountLink.object,
      url: accountLink.url,
    };
  } else {
    const accountService = await stripe.accounts.retrieve(
      craftman.accountIdStripe
    );
    if (accountService.details_submitted) {
      const loginLink = await stripe.accounts.createLoginLink(
        craftman.accountIdStripe
      );
      return {
        object: loginLink.object,
        url: loginLink.url,
      };
    } else {
      const accountLink = await stripe.accountLinks.create({
        account: craftman.accountIdStripe,
        refresh_url: "http://localhost:5173/",
        return_url: "http://localhost:5173/",
        type: "account_onboarding",
      });

      return {
        object: accountLink.object,
        url: accountLink.url,
      };
    }
  }
}

async function setProgressCraftman(userId, step) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const craftmanObject = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(craftmanObject);

  if (!user) {
    throw new createError(404, "Usuario no encontrado");
  }

  const craftman = await Craftman.findOne({ user: craftmanObject });

  if (!craftman) {
    throw new createError(404, "Craftman no encontrado");
  }

  if (step > 8) {
    throw new createError(400, "Error, porfavor contactar al administrador");
  }

  if (craftman.step <= step) {
    const craftmanUpdated = await Craftman.findByIdAndUpdate(
      craftman._id,
      { step },
      { new: true }
    );
    return craftmanUpdated;
  } else {
    return craftman;
  }
}

// async function getAllCraftsmen() {
//   return await Craftman.find();
// }

// async function getAllCraftsmen() {
//   const allCraftsmen = await Craftman.find().populate({
//     path: "categories",
//     select: "name",
//   });
//   return allCraftsmen;
// }

async function getAllCraftsmen() {
  const allCraftsmen = await Craftman.find({ isCraftsman: "accepted" }).select(
    "categories isCraftsman user websiteId"
  );
  return allCraftsmen;
}

module.exports = {
  createProduct,
  getAllProductsByCraftman,
  updateProduct,
  deleteProduct,
  getBankInformation,
  setProgressCraftman,
  getAllCraftsmen,
};
