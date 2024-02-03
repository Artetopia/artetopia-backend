const mongoose = require("mongoose");

const templateColorsSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  primaryColor: {
    type: String,
    required: true,
    trim: true,
  },
  secondaryColor: {
    type: String,
    required: true,
    trim: true,
  },
  tertiaryColor: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

module.exports = mongoose.model("templateColors", templateColorsSchema);
