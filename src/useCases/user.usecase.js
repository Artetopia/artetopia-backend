const createError = require("http-errors");
const mongoose = require("mongoose");

const Order = require("../models/order.model");

async function getOrderShippingStatus(orderId) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new createError(400, "Id inválido");
  }

  const orderObject = new mongoose.Types.ObjectId(orderId);
  const order = await Order.findById(orderObject).select("shippingStatus");
  if (!order) {
    throw new createError(404, "Orden no encontrada");
  }
  return order.shippingStatus;
}

module.exports = { getOrderShippingStatus };
