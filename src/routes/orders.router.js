const express = require("express");
const OrderUseCase = require("../useCases/order.usecase");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", auth, async (request, response) => {
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

module.exports = router;
