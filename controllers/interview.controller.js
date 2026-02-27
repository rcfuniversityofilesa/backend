const Interview = require('../models/interview.model')
const ExamResult = require('../models/examResult.model')
const mongoose = require('mongoose')

exports.createInterview = async (req, res) => {
  try {
    const { applicantId } = req.params
    if (!mongoose.Types.ObjectId.isValid(applicantId)) return res.status(400).json({ message: 'Invalid applicantId' })

    const examResult = await ExamResult.findOne({ applicantId }).lean()
    if (!examResult) return res.status(400).json({ message: 'Applicant must complete exam before interview.' })

    const interview = await Interview.create({
      applicantId,
      markedBy: req.adminId,
      markedAt: new Date()
    })

    return res.status(201).json({ message: 'Interview created', interview })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
