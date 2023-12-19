import mongoose from 'mongoose';

const craftsmanSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    minLength: 6,
    maxLenght: 19,
    trim: true,
  },
  websiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'website',
  },
  templateId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tempmlate',
    },
  ],
  templateColorsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'templateColors',
    },
  ],
  itemsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'item',
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categoryl1',
    },
  ],
  shipment: {
    type: Boolean,
    required: true,
  },
  accountIdStripe: {
    type: String,
    required: true,
  },
  isCrafstman: {
    type: String,
    enum: ['process', 'accepted', 'declined'],
    required: true,
  },
  step: {
    type: Number,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  tier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tier',
  },
});

module.exports = mongoose.model('craftsman', craftsmanSchema);
