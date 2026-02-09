const mongoose = require('mongoose')

const adminReplySchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usersMessage',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: true
  },
  response: {
    type: String,
    trim: true,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  emailStatus: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'sent'
  }
})

module.exports = mongoose.model('adminReply', adminReplySchema)
