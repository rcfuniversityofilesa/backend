const mongoose = require('mongoose');


const examResultSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkersForm',
      required: true,
      index: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      trim: true
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        selectedAnswer: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],

    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },

    totalQuestions: {
      type: Number,
      required: true
    },

    correctAnswers: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['pass', 'fail'],
      required: true,
      index: true
    },

    submittedAt: {
      type: Date,
      default: Date.now,
      required: true
    },

    duration: {
      type: Number, // Actual time taken in minutes
      min: 0
    }
  },
  {
    timestamps: true,
    collection: 'examResults'
  }
);

// Prevent duplicate submissions - unique compound index on exam + applicant
examResultSchema.index({ examId: 1, applicantId: 1 }, { unique: true });

// Indexes for efficient queries
examResultSchema.index({ status: 1, submittedAt: -1 });
examResultSchema.index({ email: 1 });
examResultSchema.index({ fullName: 1 });

module.exports = mongoose.model('ExamResult', examResultSchema);
