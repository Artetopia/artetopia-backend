const express = require("express");
const OrderUseCase = require("../useCases/order.usecase");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/craftsman", auth, async (request, response) => {
  try {
    const orders = await OrderUseCase.getAllOrdersByCraftsman(request.user);
    response.json({
      message: "Obtener todas las órdenes de un artesano",
      data: { orders: orders },
    });
  } catch (error) {
    response.status(500);
    response.json({
      message: "Algo fue mal",
      error: error.message,
    });
  }
});

router.get("/craftsman/:orderId", auth, async (request, response) => {
  try {
    const orders = await OrderUseCase.getOrderDetailCraftman(request.user, request.params.orderId);
    response.json({
      message: "Obtener el detalle de una orden de un artesano",
      data: { orders: orders },
    });
  } catch (error) {
    response.status(500);
    response.json({
      message: "Algo fue mal",
      error: error.message,
    });
  }
});

router.get("/user/:orderId", auth, async (request, response) => {
  try {
    const orders = await OrderUseCase.getOrderDetailClient(request.user, request.params.orderId);
    response.json({
      message: "Obtener el detalle de una orden de un cliente",
      data: { orders: orders },
    });
  } catch (error) {
    response.status(500);
    response.json({
      message: "Algo fue mal",
      error: error.message,
    });
  }
});

router.get("/user", auth, async (request, response) => {
  try {
    const orders = await OrderUseCase.getAllOrdersClient(request.user);
    response.json({
      message: "Se obtuvieron todas las ordenes del cliente",
      data: { orders: orders },
    });
  } catch (error) {
    response.status(500);
    response.json({
      message: "Algo fue mal",
      error: error.message,
    });
  }
});

router.patch("/rateOrder", auth, async (request, response) => {
  try {
    const order = await OrderUseCase.rateOrder(request.user, request.body);
    response.json({
      message: "Calificaste al artesano correctamente",
      data: {
        rating: order,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
})

module.exports = router;