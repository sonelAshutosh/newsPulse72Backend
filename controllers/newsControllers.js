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

export const getOneNews = async (req, res) => {
  let news
  try {
    news = await News.findById(req.params.newsId).exec()
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
