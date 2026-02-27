const mongoose = require('mongoose')

module.exports = function (paramName = 'id') {
  return function (req, res, next) {
    const val = req.params[paramName] || req.body[paramName] || req.query[paramName]
    if (!val) return res.status(400).json({ message: 'Missing identifier' })
    if (!mongoose.Types.ObjectId.isValid(val)) return res.status(400).json({ message: 'Invalid ObjectId' })
    next()
  }
}
