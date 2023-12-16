import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 20,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 40,
    maxLength: 160,
  },
  images: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'multimedia',
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'multimedia',
  },
  sections: [
    {
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
      backgroundImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'multimedia',
      },
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
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'template',
  },
});

module.exports = mongoose.model('website', websiteSchema);
