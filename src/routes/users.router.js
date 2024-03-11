const express = require("express");
const UserUseCase = require("../useCases/user.usecase");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:orderId/shippingStatus", auth, async (request, response) => {
  try {
    const order = await UserUseCase.getOrderShippingStatus(
      request.params.orderId
    );
    response.json({
      message: "Order delivery status",
      data: { order: order },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
});

router.post("/checkout", auth, async (request, response) => {
  try {
    const orders = await UserUseCase.checkout(request.user, request.body);
    response.json({
      message: "Orden(s) creadas correctamente",
      data: {
        orders: orders
      }
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
})

module.exports = router;
