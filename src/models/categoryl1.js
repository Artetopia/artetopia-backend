import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 4,
    maxLength: 14,
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
});

module.exports = mongoose.model('categoryl1', categorySchema);
