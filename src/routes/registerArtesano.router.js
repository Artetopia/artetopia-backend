const express = require("express");
const registerArtesanoUseCase = require("../useCases/registerArtesano.usecase");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/product", auth, async (request, response) => {
    try {
        const productCreated = await registerArtesanoUseCase.createProduct(request.user, request.body)
        // console.log(request.user);
        response.json({
            message: "Producto creado",
            data: {
                product: productCreated
            }
        })
    } catch (error) {
        response.status(error.status || 500);
        response.json({
            message: "Algo salio mal",
            error: error.message,
        });
    }
});

router.get("/getAllProductsByCraftman", auth, async (request, response) => {
    try {
        const products = await registerArtesanoUseCase.getAllProductsByCraftman(request.user);
        response.json({
            message: "productos",
            data: {
                products
            }
        })
    } catch (error) {
        response.status(error.status || 500);
        response.json({
            message: "Algo salio mal",
            error: error.message,
        });
    }
});

router.patch("/UpdateProduct/:productId", auth, async (request, response) => {
    try {
        const productId = request.params.productId;
        const updatedProduct = await registerArtesanoUseCase.updateProduct(productId, request.body);
        response.json({
            message: "Se actualizo el producto",
            data: {
                product: updatedProduct
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

router.delete("/product/:productId", auth, async (request, response) => {
    try {
        const productId = request.params.productId;
        const productDeleted = await registerArtesanoUseCase.deleteProduct(productId);
        response.json({
            message: "Producto eliminado",
            data: {
                product: productDeleted
            }
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