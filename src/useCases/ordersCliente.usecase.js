const createError = require("http-errors");
const mongoose = require("mongoose");

const User = require("../models/user.model")
const Orders = require("../models/order.model")

async function getAllOrdersClient(userId) {
    if (!mongoose.isValidObjectId(userId)) {
        throw new createError(400, "Id invalido");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new createError(404, "Usuario no encontrado");
    }

    const ordersAll = await Orders.find({ user: user._id })
    .populate({ path: "user", select: "name surname" });

  return ordersAll;
}

async function getByIdOrder(orderId) {
    if (!mongoose.isValidObjectId(orderId)) {
        throw new createError(400, "Id inválido");
      }
    
      const orderIdObject = new mongoose.Types.ObjectId(orderId);
      const orderbyId = await Orders.findById(orderIdObject);
      if (!orderbyId) {
        throw new createError(404, "Orden no encontrada");
      }
      return orderbyId;
    
}

module.exports = {
    getAllOrdersClient,
    getByIdOrder
}