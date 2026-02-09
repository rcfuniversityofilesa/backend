const postNews = require('../models/news.model')
const postProgram = require('../models/program.model')
const newWorker = require('../models/workersForm.model')
const Hymn = require('../models/Hyms.model')
const usersMessageModel = require('../models/usersMessage.model')
const mongoose = require('mongoose')



exports.deleteAppliedWorker = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' })
    }

    const deleted = await newWorker.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Program not found' })
    }

    res.status(200).json({ success: true, message: 'Program Deleted Successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message })
  }
}


exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' })
    }

    const deleted = await postNews.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'News not found' })
    }

    res.status(200).json({ success: true, message: 'News Deleted Successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message })
  }
}



exports.deleteProgram = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' })
    }

    const deleted = await postProgram.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Program not found' })
    }

    res.status(200).json({ success: true, message: 'Program Deleted Successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message })
  }
}


exports.deleteHymn = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' })
    }

    const deleted = await Hymn.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Hymn not found' })
    }

    res.status(200).json({ success: true, message: 'Hymn Deleted Successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message })
  }
}

exports.deleteRepliedMessageFromView = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID' })
        }

        const message = await usersMessageModel.findById(id)
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' })
        }

        await usersMessageModel.findByIdAndDelete(id)

        return res.status(200).json({ success: true, message: 'Message deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}