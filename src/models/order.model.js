const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  address: {
    type: Object,
    street: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    extNumber: {
      type: String,
      required: true,
      trim: true,
    },
    intNumber: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 5,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 44,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      maxLenght: 19,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      maxLenght: 6,
    },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentIntentStripe: {
    type: String,
  },
  shippingStatus: {
    type: String,
    enum: ["created", "processed", "shipped", "delivered"],
    default: "created",
  },
  trackingNumber: {
    type: String,
    trim: true,
  },
  carrier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carrier",
  },
  trackingImage: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "multimedia",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "feedback",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  craftsman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "craftsman",
  },
  orderNumber: {
    type: String,
    trim: true,
  }
});

module.exports = mongoose.model("order", orderSchema);
