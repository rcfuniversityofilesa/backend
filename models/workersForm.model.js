const mongoose = require('mongoose');

const workersFormSchema = new mongoose.Schema({
    passport: { type: String, trim: true },

    fullName: { type: String, required: true, trim: true },

    gender: { 
        type: String,
        enum: ['male', 'female'], 
        required: true 
    },

    phoneNumber: { type: String, required: true, trim: true },

    DOB: { type: Date, required: true },

    capAddress: { type: String, required: true, trim: true },

    homeAddress: { type: String, required: true, trim: true },

    programme: { type: String, required: true, trim: true },

    level: { type: String, required: true, trim: true },

    saved: { type: String, required: true, trim: true },

    salvationStory: { type: String, required: true, trim: true },

    baptized: { type: String, required: true, trim: true },
    
    holySpiritbaptized: { type: String, required: true, trim: true },

    unit: { type: String, required: true, trim: true },

    reason: { type: String, required: true, trim: true },

    relationship: { type: String, required: true, trim: true },

    details: { type: String, required: true, trim: true },

    declaration: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('WorkersForm', workersFormSchema);
