const mongoose = require("mongoose");

const templateSchema = {
  name: {
    type: String,
    enum: ["A", "B"],
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

module.exports = mongoose.model("template", templateSchema);
