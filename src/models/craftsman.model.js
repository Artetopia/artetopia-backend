import mongoose from 'mongoose';

const craftsmanSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    minLength: 6,
    maxLenght: 19,
    trim: true,
  },
  website: {},
  itemsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'item',
  },
  categories: {},
  shipment: {},
  accountIdStripe: {},
  isCrafstman: {
    type: String,
    enum: ['process', 'accepted', 'declined'],
  },
  step: {
    type: Number,
  },
  reatedAt: {
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
