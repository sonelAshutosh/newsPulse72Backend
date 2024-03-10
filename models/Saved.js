import mongoose, { model } from 'mongoose'

const savedSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  newsId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default model('Saved', savedSchema)
