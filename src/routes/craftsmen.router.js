const express = require("express");
const registerArtesanoUseCase = require("../useCases/registerArtesano.usecase");
const CraftmanUseCase = require("../useCases/craftsman.usecase");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/product", auth, async (request, response) => {
  try {
    const productCreated = await CraftmanUseCase.createProduct(
      request.user,
      request.body
    );
    response.json({
      message: "Producto creado",
      data: {
        product: productCreated,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.get("/productByCraftman", auth, async (request, response) => {
  try {
    const products = await CraftmanUseCase.getAllProductsByCraftman(
      request.user
    );
    response.json({
      message: "productos",
      data: {
        products,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.patch("/product/:productId", auth, async (request, response) => {
  try {
    const productId = request.params.productId;
    const updatedProduct = await CraftmanUseCase.updateProduct(
      productId,
      request.body
    );
    response.json({
      message: "Se actualizo el producto",
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.delete("/product/:productId", auth, async (request, response) => {
  try {
    const productId = request.params.productId;
    const productDeleted = await CraftmanUseCase.deleteProduct(productId);
    response.json({
      message: "Producto eliminado",
      data: {
        product: productDeleted,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.get("/bankAccount", auth, async (request, response) => {
  try {
    const bankAccount = await CraftmanUseCase.getBankInformation(request.user);
    response.json({
      message: "Cuenta de banco creada",
      data: {
        bankAccount: bankAccount,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.patch("/registrationProgress/:step", auth, async (request, response) => {
  try {
    const step = request.params.step;
    const stepResult = await CraftmanUseCase.setProgressCraftman(
      request.user,
      step
    );
    response.json({
      message: "Se asigno correctamente el progreso",
      data: {
        craftman: stepResult,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.patch("/selectTemplate", auth, async (request, response) => {
  try {
    const selectTemplate = await CraftmanUseCase.setTemplateAndColor(
      request.user,
      request.body
    );
    response.json({
      message: "Se guardo correctamente la información",
      data: {
        craftman: selectTemplate,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.get("/selectTemplate", auth, async (request, response) => {
  try {
    const selectTemplate = await CraftmanUseCase.getTemplateColor(request.user);
    response.json({
      message: "Información traida con exito",
      data: {
        craftman: selectTemplate,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.get("/allCraftsmen", async (request, response) => {
  try {
    const allCraftsmen = await CraftmanUseCase.getAllCraftsmen();
    response.json({
      message: "Obtener todos los artesanos de la BBDD",
      data: { craftsmen: allCraftsmen },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo fue mal",
      error: error.message,
    });
  }
});

router.get("/allCraftsmenAuth", auth, async (request, response) => {
  try {
    const allCraftsmenAuth = await CraftmanUseCase.getAllCraftsmenAuth();
    response.json({
      message: "Obtener todos los artesanos de la BBDD",
      data: { craftsmen: allCraftsmenAuth },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
});

router.patch("/uploadPhotos", auth, async (request, response) => {
  try {
    const uploadPhotos = await CraftmanUseCase.uploadPhotos(request.user, request.body);
    response.json({
      message: "Se actualizo la informacíon",
      data: {
        craftman: uploadPhotos
      }
    });
  } catch(error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
});

router.get("/photos", auth, async (request, response) => {
  try {
    const craftman = await CraftmanUseCase.getUploadPhotos(request.user);
    response.json({
      message: "Se encontró información",
      data: {
        craftman: craftman
      }
    });

  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
});

router.get("/siteInformation", auth, async (request, response) => {
  try {
    const craftsman = await CraftmanUseCase.getCraftmanSiteInformation(request.user);
    response.json({
      message: "Información del sitio del artesano encontrada con éxito",
      data: {
        craftsman: craftsman,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
});

router.get("/personalInformation", auth, auth, async (request, response) => {
  try {
    const craftsman = await CraftmanUseCase.getCraftsmanPersonalInformation(request.user);
    response.json({
      message: "Información del artesano encontrada con éxito",
      data: {
        craftsman: craftsman,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    })
  }
})

router.get("/:userId", auth, async (request, response) => {
  try {
    const craftman = await CraftmanUseCase.getCraftmanById(request.params.userId);
    response.json({
      message: "Craftman encontrado con éxito",
      data: {
        craftman: craftman
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
})

router.get("/getCraftmanTemplate/:userId", async(request, response) => {
  try {
    const craftman = await CraftmanUseCase.getCraftmanByIdTemplate(request.params.userId);
    response.json({
      message: "Craftman encontrado con exito",
      data: {
        craftman: craftman,
        socialMedia: craftman.socialMedia
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

module.exports = router;
