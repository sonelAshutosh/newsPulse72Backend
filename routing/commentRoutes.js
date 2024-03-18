import { Router } from 'express'
import {
  createNewComment,
  deleteComment,
  getAllComments,
  updateComment,
  getCommentById,
} from '../controllers/commentControllers.js'

const commentRouter = Router()

commentRouter.get('/', getAllComments)
commentRouter.get('/comment/:id', getCommentById)
commentRouter.post('/', createNewComment)

// this routes currently do nto work
commentRouter.put('/comment/:id', updateComment)
commentRouter.delete('/comment/:id', deleteComment)

export default commentRouter
