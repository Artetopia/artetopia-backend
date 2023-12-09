import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 40,
    maxLength: 160,
  },
  inventory: {
    type: Number,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'multimedia',
    },
  ],
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
    ref: 'craftsman',
  },
});

module.exports = mongoose.model('product', productSchema);