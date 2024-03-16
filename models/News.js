import mongoose, { model } from 'mongoose'

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  summary: {
    type: String,
  },
  imageURL: {
    type: String,
    required: false,
  },
  sourceURL: {
    type: String,
    required: false,
  },
  datePosted: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  category: {
    type: Array,
    default: [],
  },
  likes: [
    {
      type: String,
    },
  ],
  disLikes: [
    {
      type: String,
    },
  ],
})

export default model('News', newsSchema)
