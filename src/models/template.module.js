import mongoose from 'mongoose';

const templateSchema = {
  name: {
    type: String,
    enum: ['A', 'B'],
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
};

module.express = mongoose.model('template', templateSchema);
