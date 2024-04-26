import News from '../models/News.js'

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
  const { title, content, summary, category, isVerified } = req.body

  let existingNews
  try {
    existingNews = await News.findByIdAndUpdate(newsId, {
      title,
      content,
      summary,
      category,
      isVerified,
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
    console.log(err)
  }

  if (!news)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })

  return res.status(200).json({ news })
}

export const getNotVerifiedNews = async (req, res) => {
  let news
  console.log('Veriefied')
  try {
    news = await News.find({ isVerified: false }).sort({ createdAt: -1 }).exec()
  } catch (err) {
    console.log(err)
  }

  if (!news)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })

  return res.status(200).json({ news })
}

export const likeNews = async (req, res) => {
  let newsArticle

  try {
    newsArticle = await News.findById(req.params.id)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server Error' })
  }

  if (!newsArticle) {
    return res.status(404).json({ message: 'News article not found' })
  }

  let likesCount = newsArticle.likes.length

  if (newsArticle.likes.includes(req.body.userId)) {
    return res.status(400).json({ message: 'Already Liked', likesCount })
  }

  const indexOfUserDislike = newsArticle.disLikes.indexOf(req.body.userId)
  if (indexOfUserDislike !== -1) {
    newsArticle.disLikes.splice(indexOfUserDislike, 1)
  }

  newsArticle.likes.push(req.body.userId)

  try {
    await newsArticle.save()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server Error' })
  }

  likesCount = newsArticle.likes.length

  return res.status(200).json({ message: 'News Article Liked', likesCount })
}

export const dislikeNews = async (req, res) => {
  let newsArticle

  try {
    newsArticle = await News.findById(req.params.id)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server Error' })
  }

  if (!newsArticle) {
    return res.status(404).json({ message: 'News article not found' })
  }

  let dislikesCount = newsArticle.disLikes.length

  if (newsArticle.disLikes.includes(req.body.userId)) {
    return res.status(400).json({ message: 'Already Disliked', dislikesCount })
  }

  const indexOfUserLike = newsArticle.likes.indexOf(req.body.userId)
  if (indexOfUserLike !== -1) {
    newsArticle.likes.splice(indexOfUserLike, 1)
  }

  newsArticle.disLikes.push(req.body.userId)

  try {
    await newsArticle.save()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server Error' })
  }

  dislikesCount = newsArticle.disLikes.length

  return res
    .status(200)
    .json({ message: 'News Article Disliked', dislikesCount })
}
