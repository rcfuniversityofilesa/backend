module.exports = function (req, res, next) {
  const { examId, applicantId, answers, fullName, email } = req.body
  if (!examId || !applicantId || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'examId, applicantId and answers are required' })
  }

  if (!fullName || !email) return res.status(400).json({ message: 'fullName and email are required' })

  // Basic input sanitization
  req.body.fullName = String(fullName).trim()
  req.body.email = String(email).trim().toLowerCase()

  next()
}
