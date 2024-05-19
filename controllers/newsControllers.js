import News from '../models/News.js'
import User from '../models/User.js'
import Saved from '../models/Saved.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const getAllNews = async (req, res) => {
  let news
  try {
    news = await News.find().sort({ createdAt: -1 }).exec()
  } catch (err) {
    console.log(err)
  }

  if (!news)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })

  return res.status(200).json({ news })
}

export const getAllNewsByCategory = async (req, res) => {
  let news
  try {
    news = await News.find({ category: req.params.category })
      .sort({ createdAt: -1 })
      .exec()
  } catch (err) {
    console.log(err)
  }

  if (!news)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })

  return res.status(200).json({ news })
}

export const getUscNews = async (req, res) => {
  const userId = req.params.userId

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const user = await User.findById(userId).exec()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { categories } = user

    const news = await News.find({ category: { $in: categories } })
      .sort({ createdAt: -1 })
      .exec()

    if (!news || news.length === 0) {
      return res
        .status(404)
        .json({ message: "No news found for the user's categories" })
    }

    return res.status(200).json({ news })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }
}

export const getUserSavedNews = async (req, res) => {
  const userId = req.params.userId

  try {
    const savedNews = await Saved.find({ userId }, { newsId: 1 })
    const newsIds = savedNews.map((saved) => saved.newsId)

    const news = await News.find({ _id: { $in: newsIds } })
    return res.status(200).json({ news })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }
}

export const getOneNews = async (req, res) => {
  const id = req.params.newsId

  let news
  try {
    news = await News.findById(id).exec()
  } catch (err) {
    console.log(err)
  }

  if (!news)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })

  return res.status(200).json({ news })
}

export const createNewNews = async (req, res) => {
  const {
    title,
    content,
    summary,
    imageURL,
    sourceURL,
    datePosted,
    category = [],
  } = req.body

  if (
    !title &&
    title.trim() === '' &&
    !content &&
    content.trim() === '' &&
    !summary &&
    summary.trim() === '' &&
    !imageURL &&
    imageURL.trim() === '' &&
    !sourceURL &&
    sourceURL.trim() === '' &&
    !datePosted &&
    datePosted.trim() === ''
  ) {
    return res.status(404).json({ message: 'Invalid Data' })
  }

  let news

  try {
    news = new News({
      title,
      content,
      summary,
      imageURL,
      sourceURL,
      datePosted,
      category,
    })
    await news.save()
  } catch (err) {
    console.log(err)
  }

  return res.status(201).json({ news })
}

export const updateOneNews = async (req, res) => {
  const newsId = req.params.newsId
  const { title, content, summary, category, isVerified, imageURL } = req.body

  let existingNews
  try {
    existingNews = await News.findByIdAndUpdate(newsId, {
      title,
      content,
      summary,
      category,
      isVerified,
      imageURL,
    })
  } catch (err) {
    console.log(err)
  }

  if (!existingNews)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })

  return res.status(200).json({ message: 'News Updated Successfully' })
}

export const getVerifiedNews = async (req, res) => {
  let news
  try {
    news = await News.find({ isVerified: true }).sort({ createdAt: -1 }).exec()
  } catch (err) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  if (!news || news.length === 0) {
    return res.status(404).json({ message: 'No verified news found' })
  }

  return res.status(200).json({ news })
}

export const getNotVerifiedNews = async (req, res) => {
  let news
  try {
    news = await News.find({ isVerified: false }).sort({ createdAt: -1 }).exec()
  } catch (err) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  if (!news || news.length === 0) {
    return res.status(404).json({ message: 'No verified news found' })
  }

  return res.status(200).json({ news })
}

export const likeNews = async (req, res) => {
  const userId = req.params.userId
  const newsId = req.params.newsId

  try {
    // Find the news by its ID
    const news = await News.findById(newsId)

    if (!news) {
      return res.status(404).json({ message: 'News not found' })
    }

    const hasLiked = news.likes.includes(userId)
    const hasDisliked = news.disLikes.includes(userId)

    if (!hasLiked) {
      // Add user ID to likes array
      news.likes.push(userId)

      // If user previously disliked, remove their ID from dislikes array
      if (hasDisliked) {
        news.disLikes = news.disLikes.filter((id) => id !== userId)
      }

      await news.save()
      return res.status(200).json({
        message: 'News Liked',
        likesCount: news.likes.length,
        disLikesCount: news.disLikes.length,
      })
    } else {
      // Remove user ID from likes array
      news.likes = news.likes.filter((id) => id !== userId)
      await news.save()
      return res
        .status(200)
        .json({ message: 'News Unliked', likesCount: news.likes.length })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const dislikeNews = async (req, res) => {
  const userId = req.params.userId
  const newsId = req.params.newsId

  try {
    // Find the news by its ID
    const news = await News.findById(newsId)

    if (!news) {
      return res.status(404).json({ message: 'News not found' })
    }

    const hasDisliked = news.disLikes.includes(userId)
    const hasLiked = news.likes.includes(userId)

    if (!hasDisliked) {
      // If the user hasn't disliked the news yet, add their ID to the dislikes array
      news.disLikes.push(userId)

      // If the user has previously liked the news, remove their like
      if (hasLiked) {
        news.likes = news.likes.filter((id) => id !== userId)
      }

      await news.save()
      return res.status(200).json({
        message: 'News Disliked',
        likesCount: news.likes.length,
        disLikesCount: news.disLikes.length,
      })
    } else {
      // If the user has already disliked the news, remove their ID from the dislikes array
      news.disLikes = news.disLikes.filter((id) => id !== userId)
      await news.save()
      return res.status(200).json({
        message: 'Dislike Removed',
        disLikesCount: news.disLikes.length,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const summerizeNewsAndSave = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.0-pro',
  })

  const scrappedObj = req.body

  const prompt =
    scrappedObj.content +
    ' Summerize the news content into 40 to 50 words and also provide me a category to which the article belongs to in an JSON object format like {"category": "sports", "summary": "content of the article"}. The category you provide me must be one of the following - [Politics, Business, Technology, Science, Health, Sports, Entertainment, Environment, Education, Travel. Crime, Weather]'

  const summaryObj = await model.generateContent(prompt)
  console.log(summaryObj.response.text())
  const responseData = JSON.parse(summaryObj.response.text())

  try {
    const { title, content, imageURL, sourceURL, datePosted } = scrappedObj
    const { category, summary } = responseData

    const categoryArray = category.split(',').map((item) => item.trim())

    const news = new News({
      title,
      content,
      imageURL,
      sourceURL,
      datePosted,
      category: categoryArray,
      summary,
    })
    // console.log(news)
    await news.save()

    return res
      .status(200)
      .json({ message: 'News Saved Successfully', category, summary })
  } catch (error) {
    console.error('Error parsing response:', error)
    return res.status(500).json({ message: 'Error parsing response' })
  }
}
