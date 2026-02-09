const mongoose = require('mongoose')

const Hymns = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    hymnNumber: { type: String, trim: true, required: true },
    stanzas: [
        { type: String, trim: true, required: true }
    ],
    chors: {
        type: String, trim: true,
    }
})

module.exports = mongoose.model('hymns', Hymns)