const createError = require("http-errors");
const multer = require("multer");
const aws = require("aws-sdk");
const mongoose = require("mongoose");

const s3Service = require("../lib/s3Service");

const Craftman = require("../models/craftsman.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Multimedia = require("../models/multimedia.model");
const Order = require("../models/order.model");

async function getAllOrdersByCraftsman(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id inválido");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new createError(404, "Usuario no encontrado");
  }

  const craftsman = await Craftman.findOne({ user: user._id });
  if (!craftsman) {
    throw new createError(404, "Craftsman no encontrado");
  }

  const orders = await Order.find({ craftsman: craftsman._id })
    .select("trackingNumber user createdAt shippingStatus")
    .populate({ path: "user", select: "name surname" });

  return orders;
}

async function getOrderDetail(userId, orderId) {
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(orderId)) {
    throw new createError(400, "Id inválido");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new createError(404, "Usuario no encontrado");
  }

  const craftsman = await Craftman.findOne({ user: user._id });
  if (!craftsman) {
    throw new createError(404, "Craftsman no encontrado");
  }

  const orders = await Order.findById(orderId)
    .select(
      "orderProducts orderNumber user createdAt address shippingStatus"
    )
    .populate({ path: "user", select: "name surname" })
    .populate({
      path: "orderProducts",
      select: "productId",
      populate: {
        path: "productId",
        select: "title images",
        populate: { path: "images", select: "url" },
      },
    });

    if(!orders) {
      throw new createError(404, "Orden no encontrada");
    }

  return orders;
}

module.exports = {
  getAllOrdersByCraftsman,
  getOrderDetail,
};
