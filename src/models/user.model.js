const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    // required: true,
    trim: true,
    minLength: 2,
    maxLength: 32,
  },
  surname: {
    type: String,
    // required: true,
    trim: true,
    minLength: 2,
    maxLength: 32,
  },
  phone: {
    type: String,
    // required: true,
    minLength: 10,
    maxLength: 10,
    match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "multimedia",
  },
  customerIdStripe: {
    type: String,
    // required: true,
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
});

module.exports = mongoose.model("user", userSchema);
