import mongoose from "mongoose";

const carrierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLenght: 15,
    trim: true,
  },
  page: {
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
});

module.express = mongoose.model("carrier", carrierSchema);
