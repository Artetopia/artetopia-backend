const express = require("express");

const orders = require("../useCases/delivery.usecase");

const router = express.Router();

router.get("/orders/:orderId/deliveryStatus", async (request, response) => {
  const orderId = request.params.orderId;

  try {
    const deliveryStatus = await orders.getDeliveryStatus(orderId);
    response.json({
      message: "Obtener status de entrega de una orden de la BBDD",
      data: { deliveryStatus: deliveryStatus },
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
