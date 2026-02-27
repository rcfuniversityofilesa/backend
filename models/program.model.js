const mongoose = require('mongoose')

const programModel = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    theme: {
        type: String,
        required: [true, 'Theme is required'],
        trim: true
    },
    programBody: {
        type: String,
        required: [true, 'Program body is required'],
        trim: true
    },
    paragraphTwo: {
        type: String,
        trim: true
    },
    paragraphThree: {
        type: String,
        trim: true
    },
    paragraphFour: {
        type: String,
        trim: true
    },
    programImage: {
        type: String,
        trim: true
    },
    programDate: {
        type: Date,
        required: [true, 'Program date is required'],
        default: Date.now
    },
    programDateTo: {
        type: Date,
        default: Date.now
    },
    programTime: {
        type: String,
        required: [true, 'Program time is required'],
        trim: true
    },
    programLocation: {
        type: String,
        required: [true, 'Program location is required'],
        trim: true
    },
})

module.exports = mongoose.model('Program', programModel)