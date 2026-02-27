const mongoose = require('mongoose')

const newsModel = new mongoose.Schema({
    headLine: {
        type: String,
        required: [true, 'Headline is required'],
        trim: true
    },
    newsBody: {
        type: String,
        required: [true, 'News body is required'],
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
    newsImage: {
        type: String,
        trim: true
    },
    newsDate: {
        type: Date,
        required: [true, 'News date is required'],
        default: Date.now
    },
    newsAuthor: {
        type: String,
        required: [true, 'News author is required'],
        trim: true
    },
})

module.exports = mongoose.model('News', newsModel)