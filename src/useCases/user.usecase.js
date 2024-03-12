const createError = require("http-errors");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/order.model");
const User = require("../models/user.model");
const Craftman = require("../models/craftsman.model");
const Product = require("../models/product.model");
const Tier = require("../models/tier.model");

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

async function checkout(userId, checkoutObject) {
  const {products, cardId, address} = checkoutObject;

  if(!mongoose.isValidObjectId(userId)) {
    throw new createError(400, "Id no valido");
  }

  const user = await User.findById(userId);
  if(!user) {
    throw new createError(404, "Usuario no encontrado");
  }

  if(!user.customerIdStripe) {
    const createCustomerStripe = await stripe.customers.create({
      name: user.name,
      email: user.email
    });

    if(!createCustomerStripe) {
      throw new createError(400, "Error, porfavor intente de nuevo");
    }

    const updateUser = await User.findByIdAndUpdate(user._id, {customerIdStripe: createCustomerStripe.id}, {new: true});
    if(!updateUser) {
      throw new createError(400, "Error al actualizar el usuario");
    }
  }

  // const userNew = await User.findById(userId);

  // const cardStripe = await stripe.customers.createSource(userNew.customerIdStripe, {source: cardId});
  

  const productsByCraftman = products.reduce((acc, curr) => {
    const { craftmanId, ...rest } = curr;
    if (!acc[craftmanId]) {
      acc[craftmanId] = [];
    }
    acc[craftmanId].push(rest);
    return acc;
  }, {});

  let productsError = [];

  let craftmanWithProducts = {};

  for(const craftmanId in productsByCraftman) {
    let productArray = [];
    if(!mongoose.isValidObjectId(craftmanId)) {
      throw new createError(400, "Id invalido");
    }
    const craftman = await Craftman.findById(craftmanId).populate({path: "user"});
    if(!craftman) {
      throw new createError(404, "Craftman no encontrado");
    }

    for(const product of productsByCraftman[craftmanId]) {
      if(!mongoose.isValidObjectId(product.productId)) {
        throw new createError(400, "Id invalido");
      }
      const foundProduct = await Product.findOne({craftsman: craftman._id, _id: product.productId});
      if(!foundProduct) {
        productsError.push(product.productId);
        continue;
      }

      if(foundProduct.inventory < product.quantity) {
        productsError.push(product.productId);
        continue;
      }

      const objectProduct = {
        productId: foundProduct._id,
        quantity: product.quantity,
        unitPrice: foundProduct.price
      }

      productArray.push(objectProduct);
    }
    craftmanWithProducts[craftmanId] = productArray;
    
  }

  if(productsError.length > 0) {
    return productsError;
  } else {
    const card = await stripe.customers.createSource(
      user.customerIdStripe,
      {
        source: cardId
      }
    );
    if(!card) {
      throw new createError(400, `hubo un error con la tarjeta ${card}`);
    }
    let paymentIntentError = {};
    let ordersCreated = [];
    let response = {};
    for(craftman in craftmanWithProducts) {
      const retrieveCraftman = await Craftman.findById(craftman).populate({path: "tier"});
      let total = 0;
      let totalStripe = 0;
      let fixAmount = 0;
      for(productByCraftman of craftmanWithProducts[craftman]) {
        total = total + (productByCraftman.quantity * productByCraftman.unitPrice);
      }
        if(card.country != "MX") {
          totalStripe = (1.16 * 3 + total) / (-1.16 * (0.036 + 0.005) + 1);
        } else {
          totalStripe = (1.16 * 3 + res) / (-1.16 * 0.036 + 1);
        }

        fixAmount = Math.round(totalStripe * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: fixAmount,
        currency: 'mxn',
        automatic_payment_methods: {
          enabled: true,
        },
        confirm: true,
        customer: user.customerIdStripe,
        off_session: true,
        // application_fee_amount: 100,
        // on_behalf_of: craftman.accountIdStripe
      });

      if(paymentIntent.status == "succeeded") {
        const uniqueOrderNumber = await generateUniqueOrderNumber();
        const createOrder = await Order.create({
          orderProducts: craftmanWithProducts[craftman],
          totalPrice: totalStripe,
          shippingStatus: "processed",
          orderNumber: uniqueOrderNumber,
          address: address,
          paymentIntentStripe: paymentIntent.id,
          user: user._id,
          craftsman: craftman
        });
        ordersCreated.push(createOrder);
      } else {
        paymentIntentError[craftman] = paymentIntent;
      }
    }

    response["orders"] = ordersCreated;
    response["errors"] = paymentIntentError;

    return response;
  }

}

async function generateUniqueOrderNumber() {
  const min = 1000;
  const max = 9999;

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const orderNumber = `ORD-${randomNumber}`;

  const existingOrder = await Order.findOne({ orderNumber });

  if (existingOrder) {
    return generateUniqueOrderNumber();
  }

  return orderNumber;
}

module.exports = { getOrderShippingStatus, checkout };
