import { Router } from 'express'
import {
  getAllUsers,
  signUp,
  signIn,
  getUserById,
  adminSignIn,
  getUserCategories,
  setUserCategories,
} from '../controllers/userController.js'
import authenticateToken from '../auth/authentication.js'

const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.post('/signUp', signUp)
userRouter.post('/signIn', signIn)
userRouter.post('/admin/signIn', adminSignIn)
userRouter.get('/user/:id', getUserById)
userRouter.post('/user/categories', getUserCategories)
userRouter.post('/user/:id/setUserCategories', setUserCategories)

export default userRouter
