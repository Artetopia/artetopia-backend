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

async function getOrderDetailCraftman(userId, orderId) {
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
      "orderProducts orderNumber user createdAt address shippingStatus craftsman"
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

    if(!orders.craftsman._id.equals(craftsman._id)) {
      throw new createError(400, "La orden no esta asginada al artesano");
    }

  return orders;
}

async function getAllOrdersClient(userId) {
  if (!mongoose.isValidObjectId(userId)) {
      throw new createError(400, "Id invalido");
  }
  const user = await User.findById(userId);
  if (!user) {
      throw new createError(404, "Usuario no encontrado");
  }

  const ordersAll = await Order.find({ user: user._id })
  .populate({ path: "user", select: "name surname" });

return ordersAll;
}
async function getOrderDetailClient(userId, orderId) {

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(orderId)) {
    throw new createError(400, "Id inválido");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new createError(404, "Usuario no encontrado");
  }
  
    const orderIdObject = new mongoose.Types.ObjectId(orderId);
    const orderbyId = await Order.findById(orderIdObject);
    if (!orderbyId) {
      throw new createError(404, "Orden no encontrada");
    }

    if(!orderbyId.user._id.equals(user._id)) {
      throw new createError(400, "La orden no esta asginada al usuario");
    }

    return orderbyId;
  
}
async function rateOrder(userId, ratingObject) {
  if(!mongoose.isValidObjectId(ratingObject.craftmanId) || !mongoose.isValidObjectId(ratingObject.orderId) || !mongoose.isValidObjectId(userId)){
    throw new createError(400,"Id invalido")
   }

   const user = await User.findById(userId);
   if(!user) {
    throw new createError(404, "Usuario no encontrado");
   }

   const craftman = await Craftman.findById(ratingObject.craftmanId)
   if(!craftman){
    throw new createError(404,"Craftman no encontrado")
   }

   const order = await Order.findById(ratingObject.orderId)
   if(!order){
    throw new createError(404,"Orden no encontrada")
   }

   if(!order.user.equals(user._id) || !order.craftsman.equals(craftman._id)) {
    throw new createError(400, "No puede calificar la orden");
   }

   if(order.feedback || order.shippingStatus !== "delivered"){
    throw new createError(400,"La orden ya fue calificada")
   }

   const orderUpdated= await Order.findByIdAndUpdate(order._id, {feedback:ratingObject.rating});
   if(!orderUpdated){
    throw new createError(400,"No se pudo calificar correctamente")
   }

   return orderUpdated
}

module.exports = {
  getAllOrdersByCraftsman,
  getOrderDetailCraftman,
  getAllOrdersClient,
  getOrderDetailClient,
  rateOrder
};
