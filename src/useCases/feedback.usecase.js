const createError = require("http-errors");
const mongoose = require("mongoose");

const Feedback = require("../models/feedback.model")
const Order = require("../models/order.model")
const Craftman = require("../models/craftsman.model")

async function createRating(ratingObject) {
   if(!mongoose.isValidObjectId(ratingObject.craftmanId) || !mongoose.isValidObjectId(ratingObject.orderId)){
    throw new createError(400,"Id invalido")
   }
   
   const craftman = await Craftman.findById(ratingObject.craftmanId)
   if(!craftman){
    throw new createError(404,"Craftman no encontrado")
   }

   const order= await Order.FindById(ratingObject.orderId)
   if(!order){
    throw new createError(404,"Orden no encontrada")
   }
   if(order.rating || order.shippingStatus !== "delivered"){
    throw new createError(400,"La orden ya fue calificada")
   }

   const rating = await Feedback.create({rating:ratingObject.rating, craftsman:craftman._id})
   if(!rating){
    throw new createError(400,"No se pudo calificar correctamente")
   }

   const orderUpdated = await Order.findByIdAndUpdate(order._id,{feedback:rating._id},{new:true})
   if(!orderUpdated){
    throw new createError(400,"Calificacion no guarda")
   }
   return orderUpdated
}
module.exports={
    createRating
}