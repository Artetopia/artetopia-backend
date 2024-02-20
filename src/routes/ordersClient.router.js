const express = require("express");
const OrderUserCase= require("../useCases/ordersCliente.usecase")
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:userId", auth, async (request, response) => {
    try {
      const orders = await OrderUserCase.getAllOrdersClient(
        request.params.userId
      );
      response.json({
        message: "Orders",
        data: {
          orders: orders
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

  router.get("/orderId/:oderId", auth, async (request, response) => {
    try {
      const orderById = await OrderUserCase.getByIdOrder(
        request.params.oderId
      );
      response.json({
        message: "Order Id",
        data: {
          orderById: orderById
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