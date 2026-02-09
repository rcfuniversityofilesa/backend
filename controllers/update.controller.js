const postNews = require('../models/news.model')
const postProgram = require('../models/program.model')
const Hymn = require('../models/Hyms.model')
const cloudinary = require('cloudinary').v2;



exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params

    let uploadedImage = null;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "rcf_news_uploads"
      });
      uploadedImage = uploadRes.secure_url;
    }

    const updated = await postNews.findByIdAndUpdate(
      id,
      {
        ...req.body, 
        newsImage: uploadedImage
      },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: "Update not found" });
    }

    res.status(200).json({ success: true, message: 'News Updated Successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message })
  }
}



exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params

    let uploadedImage = null;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "rcf_program_uploads"
      });
      uploadedImage = uploadRes.secure_url;
    }

    const updated = await postProgram.findByIdAndUpdate(
      id,
      {
        ...req.body, 
        programImage: uploadedImage
      },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: "Update not found" });
    }

    res.status(200).json({ success: true, message: 'Program Updated Successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message })
  }
}


exports.updateHymn = async (req, res) => {
  try {
    const { id } = req.params

    const updated = await Hymn.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: "Update not found" });
    }

    res.status(200).json({ success: true, message: 'Hymn Updated Successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message })
  }
}