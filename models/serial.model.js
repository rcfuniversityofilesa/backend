const mongoose = require('mongoose');

const serialCounterSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: Number,
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('SerialCounter', serialCounterSchema);