import { Router } from 'express'
import {
  getAllNews,
  createNewNews,
  getOneNews,
  updateOneNews,
  getVerifiedNews,
  getNotVerifiedNews,
  likeNews,
  dislikeNews,
  getAllNewsByCategory,
  getUscNews,
  getUserSavedNews,
} from '../controllers/newsControllers.js'

const newsRouter = Router()

newsRouter.get('/', getAllNews)
newsRouter.get('/:newsId', getOneNews)
newsRouter.get('/category/:category', getAllNewsByCategory)
newsRouter.get('/:userId/uscNews', getUscNews)
newsRouter.get('/:userId/getUserSavedNews', getUserSavedNews)

newsRouter.get('/verified', getVerifiedNews)
newsRouter.get('/notVerified', getNotVerifiedNews)

newsRouter.post('/create', createNewNews)
newsRouter.put('/update/:newsId', updateOneNews)

newsRouter.post('/:newsId/like/:userId', likeNews)
newsRouter.post('/:newsId/disLike/:userId', dislikeNews)

export default newsRouter
