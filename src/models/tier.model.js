const mongoose = require("mongoose");

const tierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 20,
    maxLength: 80,
  },
  comission: {
    type: Number,
    required: true,
    trim: true,
  },
  expirationDate: {
    type: Date,
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
});

module.exports = mongoose.model("tier", tierSchema);
