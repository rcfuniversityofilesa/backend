const mongoose = require('mongoose')
const { parsePhoneNumber } = require('libphonenumber-js')

const phoneField = {
  type: String,
  required: [true, 'Phone number is required'],
  unique: true,
  trim: true,

  set: function(raw) {
    if (!raw) return raw
    try {
      const phone = parsePhoneNumber(raw, 'NG')
      if (phone.isValid()) return phone.number
      return raw
    } catch {
      return raw
    }
  },

  validate: {
    validator: function(v) {
      if (!v) return true
      try {
        const phone = parsePhoneNumber(v)
        return phone.isValid() && phone.isPossible()
      } catch {
        return false
      }
    },
    message: props => `${props.value} is invalid`
  }
}

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: { type: String, required: true, trim: true },

  serialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  gender: { type: String, trim: true },
  phoneNumber: phoneField,
  passport: { type: String, trim: true },
  inductionYear: { type: String, trim: true },
  position: { type: String, trim: true },

  resetPasswordToken: String,
  resetPasswordExpire: Date
})

module.exports = mongoose.model('Admin', adminSchema)
