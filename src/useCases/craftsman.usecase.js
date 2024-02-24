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
const Template = require("../models/template.model");
const TemplateColor = require("../models/templateColors.model");
const Website = require("../models/website.model");
const Feedback = require("../models/feedback.model");
const Order = require("../models/order.model");

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

  const ProductDeleted = await Product.findByIdAndDelete(productId);
  return ProductDeleted;
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

async function setTemplateAndColor(userId, objectCraftman) {
  const { template, templateColorId } = objectCraftman;

  if (!mongoose.isValidObjectId(templateColorId)) {
    throw new createError(400, "Id invalido");
  }

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

  const templateObject = await Template.findOne({ name: template });

  if (!templateObject) {
    throw new createError(404, "Template no encontrado");
  }

  const templateColor = await TemplateColor.findById(templateColorId);

  if (!templateColor) {
    throw new createError(404, "Template color no encontrado");
  }

  const craftmanUpdated = await Craftman.findByIdAndUpdate(
    craftman._id,
    { templateId: templateObject._id, templateColorsId: templateColor._id },
    { new: true }
  )
    .populate({ path: "templateId", select: "id name hasSections hasVideo" })
    .populate("templateColorsId")
    .populate({ path: "productsId", populate: { path: "images" } })
    .populate("categories")
    .populate("user");

  return craftmanUpdated;
}

async function getTemplateColor(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const craftman = await Craftman.findOne({ user: userId })
    .populate({ path: "templateId", select: "id name hasSections hasVideo" })
    .populate({
      path: "templateColorsId",
      select: "id primaryColor secondaryColor tertiaryColor isActive",
    });

  if (!craftman) {
    throw new createError(404, "Craftman no encontrado");
  }

  const craftmanOptions = {
    id: craftman._id,
    template: craftman.templateId,
    templateColor: craftman.templateColorsId,
  };

  return craftmanOptions;
}
async function getAllCraftsmen() {
  const allCraftsmen = await Craftman.find({ isCraftsman: "accepted" })
    .select("categories craftsman isCraftsman user websiteId")
    .populate({ path: "banner", select: "url" })
    .populate({ path: "categories", select: "name" })
    .populate({
      path: "user",
      select: "avatar",
      populate: { path: "avatar", select: "url" },
    })
    .populate({
      path: "websiteId",
      select: "name images",
      populate: { path: "images", select: "url" },
    });
  return allCraftsmen;
}

async function getAllCraftsmenAuth() {
  const allCraftsmenAuth = await Craftman.find({ isCraftsman: "accepted" })
    .select("categories isCraftsman craftsman feedback user websiteId")
    .populate({ path: "categories", select: "name" })
    .populate({
      path: "user",
      select: "avatar",
      populate: { path: "avatar", select: "url" },
    })
    .populate({ path: "feedback", select: "rating" })
    .populate({
      path: "websiteId",
      select: "name",
    });
  return allCraftsmenAuth;
}

async function getAllOrdersByCraftsman(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id inválido");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new createError(404, "Usuario no encontrado");
  }

  const craftsman = await Craftman.findOne({ user: user._id });
  if (!craftsman) {
    throw new createError(404, "Craftsman no encontrado");
  }

  const orders = await Order.find({ craftsman: craftsman._id });

  return orders;
}

async function uploadPhotos(userId, photosObject) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const ObjectUser = new mongoose.Types.ObjectId(userId);
  const craftman = await Craftman.findOne({ user: ObjectUser });
  if (!craftman) {
    throw new createError(404, "Craftman no encontrado");
  }

  const isBase64ImageProfilePicture =
    /^data:image\/(jpeg|png|gif|jpg);base64,/.test(photosObject.profilePicture);

  if (isBase64ImageProfilePicture) {
    const [, mimeProfilePicture, dataProfilePicture] =
      /^data:(image\/\w+);base64,(.+)$/.exec(photosObject.profilePicture) || [];
    if (!mimeProfilePicture || !dataProfilePicture) {
      throw new createError(400, "formato invalido foto de perfil");
    }

    const extensionProfilePicture = mimeProfilePicture.split("/")[1] || "jpg"; // Default to 'jpg' if extension is not found
    const imageBufferProfilePicture = Buffer.from(dataProfilePicture, "base64");

    const objectProfilePicture = {
      buffer: imageBufferProfilePicture,
      extension: extensionProfilePicture,
    };

    const uploadProfilePicture = await s3Service.s3UploadUnique(
      objectProfilePicture
    );

    const objectMultimediaProfilePicture = {
      url: uploadProfilePicture.Location,
      key: uploadProfilePicture.key,
    };
    const saveImageProfilePicture = await Multimedia.create(
      objectMultimediaProfilePicture
    );
    if (!saveImageProfilePicture) {
      throw new createError(400, "Error al guardar la imagen de perfil");
    }

    const user = User.findByIdAndUpdate(ObjectUser, {
      avatar: saveImageProfilePicture._id,
    });
    if (!user) {
      throw new createError(400, "Error al guardar la imagen de perfil");
    }
  }

  const isBase64ImageBanner = /^data:image\/(jpeg|png|gif|jpg);base64,/.test(
    photosObject.banner
  );

  if (isBase64ImageBanner) {
    const [, mimeBanner, dataBanner] =
      /^data:(image\/\w+);base64,(.+)$/.exec(photosObject.banner) || [];
    if (!mimeBanner || !dataBanner) {
      throw new createError(400, "formato invalido banner");
    }

    const extensionBanner = mimeBanner.split("/")[1] || "jpg"; // Default to 'jpg' if extension is not found
    const imageBufferBanner = Buffer.from(dataBanner, "base64");

    const objectBanner = {
      buffer: imageBufferBanner,
      extension: extensionBanner,
    };

    const uploadBanner = await s3Service.s3UploadUnique(objectBanner);

    const objectMultimediaBanner = {
      url: uploadBanner.Location,
      key: uploadBanner.key,
    };
    const saveImageBanner = await Multimedia.create(objectMultimediaBanner);
    if (!saveImageBanner) {
      throw new createError(400, "Error al guardar el banner");
    }

    const craftmanUpdated = await Craftman.findOneAndUpdate(
      { user: ObjectUser },
      { banner: saveImageBanner._id }
    );
    if (!craftmanUpdated) {
      throw new createError(400, "Error al asginar el banner al artesano");
    }
  }

  const website = await Website.findById(craftman.websiteId);

  if (!website) {
    throw new createError(404, "website no encontrado");
  }

  const objectIdImages = website.images.map((image) => {
    return image.toString();
  });

  const uniqueValuesWebsiteImages = objectIdImages.filter(
    (value) => !photosObject.images.includes(value)
  );

  if (uniqueValuesWebsiteImages.length > 0) {
    const images = await Promise.all(
      uniqueValuesWebsiteImages.map(async (image) => {
        const objectIdMultimedia = new mongoose.Types.ObjectId(image);
        const multimedia = await Multimedia.findById(objectIdMultimedia);
        const deletedFile = await s3Service.s3DeleteFile(multimedia);
        if (deletedFile) {
          const websiteUpdated = await Website.findByIdAndUpdate(
            craftman.websiteId,
            { $pull: { images: multimedia._id } }
          );
          if (websiteUpdated) {
            const deleteMultimedia = await Multimedia.findByIdAndDelete(
              multimedia._id
            );
            if (!deleteMultimedia) {
              throw new createError(400, "error el aliminar la imagen");
            }
          }
        }
      })
    );
  }

  const newImagesWebsite = photosObject.newImages.map((image) => {
    const [, mimeWebsiteImage, dataWebsiteImage] =
      /^data:(image\/\w+);base64,(.+)$/.exec(image) || [];
    if (!mimeWebsiteImage || !dataWebsiteImage) {
      throw new createError(400, "Formato invalido base64");
    }

    const extension = mimeWebsiteImage.split("/")[1] || "jpg";
    const imageBuffer = Buffer.from(dataWebsiteImage, "base64");

    return { buffer: imageBuffer, extension };
  });

  const results = await s3Service.s3UploadMultiple(newImagesWebsite);

  const resultsSaveImagesWebsite = await Promise.all(
    results.map(async (image) => {
      const objectMultimedia = {
        url: image.Location,
        key: image.key,
      };

      const saveImageWebsite = await Multimedia.create(objectMultimedia);
      if (!saveImageWebsite) {
        throw new createError(400, "Error al crear las imagenes");
      }
      return saveImageWebsite._id;
    })
  );

  photosObject.images = resultsSaveImagesWebsite;

  const websiteUpdated = await Website.findByIdAndUpdate(craftman.websiteId, {
    $push: { images: photosObject.images },
  });

  if (!websiteUpdated) {
    throw new createError(400, "Error al actualizar la información");
  }

  const craftmanResult = await Craftman.findOne({ user: ObjectUser }).populate({
    path: "websiteId",
  });
  if (!craftmanResult) {
    throw new createError(400, "Error al obtener al craftman");
  }

  return craftmanResult;
}

async function getUploadPhotos(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const craftman = await Craftman.findOne(
    { user: userId },
    "user, websiteId, banner"
  )
    .populate({
      path: "user",
      select: "avatar",
      populate: { path: "avatar", select: "url" },
    })
    .populate({
      path: "websiteId",
      select: "images",
      populate: { path: "images", select: "url" },
    })
    .populate({ path: "banner", select: "url" });
  if (!craftman) {
    throw new createError(404, "No se encontro ningun artesano");
  }

  return craftman;
}

async function getCraftmanById(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }
  const craftmanObject = new mongoose.Types.ObjectId(userId);
  const getCraftmanCal = await Craftman.findOne({ user: craftmanObject });
  if (!getCraftmanCal) {
    throw new createError(404, "Craftman no encontrado");
  }

  if (getCraftmanCal.isCraftsman !== "accepted") {
    throw new createError(400, "El artesano no es valido");
  }

  const craftman = await Craftman.find({ _id: getCraftmanCal._id })
    .populate({
      path: "user",
      select: "avatar name surname",
      populate: { path: "avatar", select: "url" },
    })
    .populate({
      path: "productsId",
      populate: { path: "images", select: "url" },
    })
    .populate({ path: "categories" })
    .populate({ path: "websiteId", populate: { path: "images" } });

  return craftman;
}

async function getCraftmanPersonalInformation(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id invalido");
  }

  const craftmanObject = new mongoose.Types.ObjectId(userId);
  const getCraftman = await Craftman.findOne({ user: craftmanObject });
  if (!getCraftman) {
    throw new createError(404, "Artesano no encontrado");
  }

  if (getCraftman.isCraftsman !== "accepted") {
    throw new createError(400, "El artesano no es válido");
  }

  const craftman = await Craftman.find({ _id: getCraftman._id })
    .select("state")
    .populate({
      path: "user", select: "name surname phone" })

  return craftman;
}

module.exports = {
  createProduct,
  getAllProductsByCraftman,
  updateProduct,
  deleteProduct,
  getBankInformation,
  setProgressCraftman,
  setTemplateAndColor,
  getTemplateColor,
  getAllCraftsmen,
  getAllCraftsmenAuth,
  getAllOrdersByCraftsman,
  uploadPhotos,
  getUploadPhotos,
  getCraftmanById,
  getCraftmanPersonalInformation
};
