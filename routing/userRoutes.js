import { Router } from 'express'
import {
  getAllUsers,
  signUp,
  signIn,
  getUserById,
} from '../controllers/userController.js'
import authenticateToken from '../auth/authentication.js'

const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.post('/signUp', signUp)
userRouter.post('/signIn', signIn)
userRouter.get('/user/:id', authenticateToken, getUserById)

export default userRouter
