const mongoose = require('mongoose')

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      trim: true
    },

    questions: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true
        },
        question: {
          type: String,
          required: true,
          trim: true
        },
        options: [
          {
            type: String,
            required: true,
            trim: true
          }
        ],
        correctAnswer: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],

    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 480 // Max 8 hours
    },

    passMark: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50
    },

    isEnabled: {
      type: Boolean,
      default: true,
      index: true
    },

    startTime: {
      type: Date,
      index: true
    },

    endTime: {
      type: Date,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workersInTraining',
      required: true
    },

    totalAttempts: {
      type: Number,
      default: 0
    },

    totalPassed: {
      type: Number,
      default: 0
    },

    totalFailed: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'exams'
  }
);

// Index for efficient queries
examSchema.index({ isEnabled: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Exam', examSchema);
