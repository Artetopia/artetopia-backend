import mongoose from 'mongoose';

const templateSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  primaryColor: {
    type: String,
    required: true,
    trim: true,
  },
  secondaryColor: {
    type: String,
    required: true,
    trim: true,
  },
  tertiaryColor: {
    type: String,
    required: true,
    trim: true,
  },
  hasVideo: {
    type: Boolean,
    required: true,
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
    ref: 'craftsman',
  },
};

module.express = mongoose.model('template', templateSchema);
