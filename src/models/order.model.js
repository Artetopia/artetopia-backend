import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderItems: {},
  address: {
    type: Object,
    street: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    extNumber: {
      type: String,
      required: true,
      trim: true,
    },
    intNumber: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 5,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 44,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      maxLenght: 19,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      maxLenght: 6,
    },
  },
  shippingSatus: {
    type: String,
    enum: ['created', 'picked', 'shipped', 'delivered'],
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
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

module.exports = mongoose.model('order', orderSchema);
