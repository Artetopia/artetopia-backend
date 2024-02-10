const express = require("express");

const users = require("../useCases/user.usecase");

const router = express.Router();

router.get("/:orderId/deliveryStatus", async (request, response) => {
  const { orderId } = request.params;
  try {
    const orderDeliveryStatus = await users.getOrderDeliveryStatus(orderId);
    response.json({
      message: "order delivery status",
      data: orderDeliveryStatus,
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
