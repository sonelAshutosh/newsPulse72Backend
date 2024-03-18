import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import userRouter from './routing/userRoutes.js'
import newsRouter from './routing/newsRoutes.js'
import commentRouter from './routing/commentRoutes.js'

const app = express()
dotenv.config()

const PORT = 5500
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@newspulse72database.x9jyr7l.mongodb.net/?retryWrites=true&w=majority&appName=newsPulse72Database`

app.use(express.json())
app.use(
  cors({
    origin: '*',
  })
)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/users', userRouter)
app.use('/news', newsRouter)
app.use('/comments', commentRouter)

// ----------------------------------------------------------------
// Database Connection
// ----------------------------------------------------------------
mongoose.connect(URI).then(() => {
  app.listen(PORT, () => {
    console.log('Connected to Database')
    console.log(`App listening on PORT ${PORT}`)
  })
})
// ----------------------------------------------------------------
