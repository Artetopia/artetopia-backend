import mongoose from 'mongoose';

const multimediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
    // default: ''
  },
  key: {
    type: String,
    default: null,
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

module.exports = mongoose.model('multimedia', multimediaSchema);
