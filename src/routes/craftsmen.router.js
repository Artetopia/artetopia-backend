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

router.patch("/selectTemplate", auth, async(request, response) => {
    try {
        const selectTemplate = await CraftmanUseCase.setTemplateAndColor(request.user, request.body);
        response.json({
            message: "Se guardo correctamente la información",
            data: {
                craftman: selectTemplate
            }
        });

    } catch(error) {
        response.status(error.status || 500);
        response.json({
            message: "Algo salio mal",
            error: error.message,
        });
    }
});

router.get("/selectTemplate", auth, async(request, response) => {
    try {
        const selectTemplate = await CraftmanUseCase.getTemplateColor(request.user);
        response.json({
            message: "Información traida con exito",
            data: {
                craftman: selectTemplate
            }   
        });
    } catch(error) {
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
    response.status(500);
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
    response.status(500);
    response.json({
      message: "Algo fue mal",
      error: error.message,
    });
  }
});

module.exports = router;
