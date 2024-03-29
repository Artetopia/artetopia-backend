const mongoose = require("mongoose");

const craftsmanSchema = new mongoose.Schema({
  state: {
    type: String,
    // required: true,
    minLength: 6,
    maxLenght: 19,
    trim: true,
  },
  websiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "website",
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "template",
  },
  templateColorsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "templateColors",
  },
  productsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  ],
  shipment: {
    type: Boolean,
    // required: true,
  },
  accountIdStripe: {
    type: String,
    // required: true,
  },
  isCraftsman: {
    type: String,
    enum: ["process", "accepted", "declined"],
    // required: true,
  },
  step: {
    type: Number,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  banner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "multimedia",
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "feedback",
  },
  tier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tier",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
});

module.exports = mongoose.model("craftsman", craftsmanSchema);
