const createError = requeire("http-error");
const mongoose = require("mongoose");

const Order = require("../models/order.model");

async function getOrderDeliveryStatus(orderId) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new createError(400, "Id inválido");
  }

  const orderObject = new mongoose.Types.ObjectId(orderId);
  const getOrder = await Order.findOne({ _id: orderObject });
  if (!getOrder) {
    throw new createError(404, "Orden no encontrada");
  }

  const orderDeliveryStatus = await Order.find({
    order: new mongoose.Types.ObjectId(getOrder._id),
  }).populate({ path: "order", select: "shippingSatus" });

  return orderDeliveryStatus;
}

module.exports = { getOrderDeliveryStatus };
