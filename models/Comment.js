import mongoose, { model } from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  newsId: {
    type: String,
    required: true,
  },
})

export default model('Comment', commentSchema)
