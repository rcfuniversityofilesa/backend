const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkersForm',
      required: true,
      unique: true,
      index: true
    },

    examResultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamResult',
      required: true
    },

    interviewDate: {
      type: Date,
      required: true,
      index: true
    },

    interviewLocation: {
      type: String,
      trim: true
    },

    interviewerNotes: {
      type: String,
      trim: true
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workersInTraining',
      required: true
    },

    markedAt: {
      type: Date,
      default: Date.now
    },

    interviewScore: {
      type: Number,
      min: 0,
      max: 100
    },

    status: {
      type: String,
      enum: ['scheduled', 'completed', 'passed', 'failed', 'rescheduled', 'cancelled'],
      default: 'scheduled',
      index: true
    },

    feedback: {
      type: String,
      trim: true
    },

    reschedulingReason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'interviews'
  }
);

// Indexes for efficient queries
interviewSchema.index({ status: 1, interviewDate: 1 });
interviewSchema.index({ markedBy: 1, markedAt: -1 });

module.exports = mongoose.model('Interview', interviewSchema);
