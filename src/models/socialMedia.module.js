import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['instagram', 'tiktok', 'whatsapp', 'facebook'],
  },
  url: {
    type: String,
    required: true,
    trim: true,
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

module.exports = mongoose.model('socialMedia', socialMediaSchema);
