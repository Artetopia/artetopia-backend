const mongoose = require("mongoose");

const Order = require("../models/order.model");
const User = require("../models/user.model");
const createError = require("http-errors");

async function getDeliveryStatus(orderId) {
  // if (!mongoose.isValidObjectId(orderId.craftsmen)) {
  //   throw new createError(400, "Id inválido");
  // }
  const orderExits = await Order.findById(orderId);
  if (!orderExits) {
    throw new createError(404, "Orden no encontrada");
  }
  const deliveryStatus = orderExits.shippingSatus;
  return await deliveryStatus;
}

module.exports = { getDeliveryStatus };
