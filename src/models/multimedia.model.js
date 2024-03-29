const mongoose = require("mongoose");

const multimediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  key: {
    type: String,
    default: null,
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

module.exports = mongoose.model("multimedia", multimediaSchema);
