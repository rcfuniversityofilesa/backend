const postNews = require('../models/news.model')
const postProgram = require('../models/program.model')
const Hymn = require('../models/Hyms.model')
const cloudinary = require('cloudinary');



exports.createNewsPost = async (req, res) => {
  try {
    let uploadedImage = null

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "rcf_news_uploads"
      })
      uploadedImage = uploadRes.secure_url
    }

    const newsPost = await postNews.create({
      ...req.body,
      newsImage: uploadedImage
    })

    res.status(201).json({
      message: "News post created successfully",
      data: newsPost
    })


  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    })
  }
}

exports.getPublishedNews = async (req, res) => {
  try {
    const publishedNews = await postNews.find().sort({ _id: -1 })
    res.status(201).json({ success: true, data: publishedNews })
  } catch (err) {
    return res.status(500).send('Internal server error')
  }
}



exports.createProgramPost = async (req, res) => {
  try {
    let uploadedImage = null

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "rcf_program_uploads"
      })
      uploadedImage = uploadRes.secure_url
    }

    const programPost = await postProgram.create({
      ...req.body,
      programImage: uploadedImage
    })

    res.status(201).json({
      message: 'Program post created successfully',
      data: programPost
    })
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message })
  }
}

exports.getPublishedProgrammes = async (req, res) => {
  try {
    const publishedProgrammes = await postProgram.find().sort({ _id: -1 })
    res.status(201).json({ success: true, data: publishedProgrammes })
  } catch (err) {
    return res.status(500).send('Internal server error')
  }
}




exports.publishHymn = async (req, res) => {
  try {
    const hymn = await Hymn.create({
      ...req.body
    })

    if (!hymn) {
      return res.status(400).json({
        success: false,
        message: 'Error creating hymn'
      })
    }

    res.status(201).json({
      success: true,
      message: 'Hymn created successfully',
      data: hymn
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    })
  }
}

exports.getPublishedHymns = async (req, res) => {
  try {
    const publishedHyms = await Hymn.find().sort({ _id: -1 })
    res.status(201).json({ success: true, data: publishedHyms })
  } catch (err) {
    return res.status(500).send('Internal server error')
  }
}