const mongoose = require("mongoose");

const aditionalInfoSchema = {
  // name: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  hasVideo: {
    type: Boolean,
    required: true,
  },
  hasSections: {
    type: Boolean,
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
  craftsman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "craftsman",
  },
};

module.exports = mongoose.model("templateColors", aditionalInfoSchema);
