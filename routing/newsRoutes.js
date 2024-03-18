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
} from '../controllers/newsControllers.js'

const newsRouter = Router()

newsRouter.get('/', getAllNews)
newsRouter.get('/:newsId', getOneNews)

newsRouter.get('/verified', getVerifiedNews)
newsRouter.get('/notVerified', getNotVerifiedNews)

newsRouter.post('/create', createNewNews)
newsRouter.put('/update/:newsId', updateOneNews)

newsRouter.post('/:id/like', likeNews)
newsRouter.post('/:id/disLike', dislikeNews)

export default newsRouter
