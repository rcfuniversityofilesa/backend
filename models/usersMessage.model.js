const mongoose = require('mongoose')

const usersMessageSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        trim: true,
        required: true
    },

    message: {
        type: String,
        trim: true,
        required: true
    },

    seen: {
        type: Boolean,
        default: false
    },

    replied: {
        type: Boolean,
        default: false
    },

    repliedAt: {
        type: Date
    },

    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
},
    {
        timestamps: {
            createdAt: 'submittedAt',
            updatedAt: 'updatedAt'
        }
    })

module.exports = mongoose.model('usersMessage', usersMessageSchema)