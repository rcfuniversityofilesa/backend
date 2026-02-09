const newWorker = require('../models/workersForm.model')
const cloudinary = require('../config/cloudinary')
const usersMessageModel = require('../models/usersMessage.model')
// const cloudinary = require('cloudinary').v2;


exports.appliedWorker = async (req, res) => {
  try {
    let uploadedImage = null;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "rcf_applicantPassport"
      });
      uploadedImage = uploadRes.secure_url;
    }

    const worker = await newWorker.create({
      ...req.body,
      passport: uploadedImage
    });

    res.status(201).json({
      status: 'success',
      data: worker,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};

exports.getAppliedWorker = async (req, res) => {
  try {
    const appliedWorker = await newWorker.find().sort({ _id: -1 })
    res.status(201).json({ success: true, data: appliedWorker })
  } catch (err) {
    return res.status(500).send('Internal server error')
  }
}




exports.sendUserMessages = async (req, res) => {
    try {
        const usersMgs = await usersMessageModel.create({ ...req.body });

        if (!usersMgs) {
            return res.status(404).json({ success: false, message: "Message can't be made" })
        }

        res.status(200).json({ success: true, message: 'Message sent successfully' })
    } catch (err) {
        return res.status(500).send('Internal server error')
    }
}

exports.getUserMessages = async (req, res) => {
    try {
        const usersMgs = await usersMessageModel
            .find({ replied: false })
            .sort({ submittedAt: -1 })

        if (!usersMgs.length) {
            return res.status(200).json({
                success: true,
                data: []
            })
        }

        return res.status(200).json({
            success: true,
            data: usersMgs
        })
    } catch (err) {
        return res.status(500).send('Internal server error')
    }
}