import { Router } from 'express'
import {
  getAllNews,
  createNewNews,
  getOneNews,
} from '../controllers/newsControllers.js'

const newsRouter = Router()

newsRouter.get('/', getAllNews)
newsRouter.get('/:newsId', getOneNews)
newsRouter.post('/create', createNewNews)

export default newsRouter
