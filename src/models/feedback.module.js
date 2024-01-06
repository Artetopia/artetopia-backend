const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 40,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 40,
    maxLength: 160,
  },
  rating: {
    type: Number,
    required: true,
  },
  attachment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "multimedia",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  attachment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "craftsman",
  },
});

module.exports = mongoose.model("feedback", feedbackSchema);
