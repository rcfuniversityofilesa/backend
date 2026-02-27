const examModel = require('../models/exam.model');
const examResultModel = require('../models/examResult.model');
const workersFormModel = require('../models/workersForm.model');
const { isValidObjectId } = require('mongoose');


class ExamService {
  /**
   * Validates if an exam can be taken
   * @param {string} examId - Exam ID
   * @param {string} applicantId - Applicant ID
   * @returns {Object} - { isValid: boolean, message: string }
   */
  static async validateExamTakeable(examId, applicantId) {
    if (!isValidObjectId(examId)) {
      return { isValid: false, message: 'Invalid exam ID format.' };
    }

    if (!isValidObjectId(applicantId)) {
      return { isValid: false, message: 'Invalid applicant ID format.' };
    }

    try {
      // Check if exam exists and is enabled
      const exam = await examModel.findById(examId).lean();
      if (!exam) {
        return { isValid: false, message: 'Exam not found.' };
      }

      if (!exam.isEnabled) {
        return { isValid: false, message: 'Exam is not available.' };
      }

      // Check exam time window
      const now = new Date();
      if (exam.startTime && now < exam.startTime) {
        return {
          isValid: false,
          message: `Exam has not started yet. Available from ${exam.startTime}`
        };
      }

      if (exam.endTime && now > exam.endTime) {
        return { isValid: false, message: 'Exam has ended.' };
      }

      // Check if applicant exists in WorkersForm
      const applicant = await workersFormModel.findById(applicantId).lean();
      if (!applicant) {
        return { isValid: false, message: 'Applicant not found.' };
      }

      // Check if applicant has already taken this exam
      const existingResult = await examResultModel.findOne({
        examId,
        applicantId
      }).lean();

      if (existingResult) {
        return {
          isValid: false,
          message: 'You have already completed this exam. Duplicate submissions are not allowed.'
        };
      }

      return { isValid: true, message: 'Exam can be taken.' };
    } catch (error) {
      console.error('Exam validation error:', error);
      return { isValid: false, message: 'Error validating exam.' };
    }
  }

  /**
   * Grades submitted exam answers
   * @param {Object} examData - Exam object with questions
   * @param {Array} submittedAnswers - Array of { questionId, selectedAnswer }
   * @returns {Object} - { score, totalQuestions, correctAnswers, status }
   */
  static gradeExam(examData, submittedAnswers) {
    if (!examData.questions || examData.questions.length === 0) {
      throw new Error('Exam has no questions.');
    }

    let correctAnswers = 0;
    const totalQuestions = examData.questions.length;

    // Create a map of answers for faster lookup
    const answersMap = {};
    submittedAnswers.forEach((ans) => {
      answersMap[ans.questionId.toString()] = ans.selectedAnswer;
    });

    // Grade each question
    examData.questions.forEach((question) => {
      const qId = question._id.toString();
      const submitted = answersMap[qId];

      if (submitted && submitted.trim() === question.correctAnswer.trim()) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const status = score >= examData.passMark ? 'pass' : 'fail';

    return {
      score,
      totalQuestions,
      correctAnswers,
      status
    };
  }

  /**
   * Saves exam result
   * @param {Object} resultData - Result data to save
   * @returns {Object} - Saved result document
   */
  static async saveExamResult(resultData) {
    try {
      const newResult = new ExamResult(resultData);
      const savedResult = await newResult.save();

      // Update exam statistics
      await Exam.findByIdAndUpdate(
        resultData.examId,
        {
          $inc: {
            totalAttempts: 1,
            ...(resultData.status === 'pass'
              ? { totalPassed: 1 }
              : { totalFailed: 1 })
          }
        },
        { new: true }
      );

      return savedResult;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.examId) {
        throw new Error('Duplicate exam submission detected.');
      }
      throw error;
    }
  }

  /**
   * Fetches exam with populated creator info
   * @param {string} examId - Exam ID
   * @returns {Object} - Exam document
   */
  static async getExamById(examId) {
    if (!isValidObjectId(examId)) {
      throw new Error('Invalid exam ID format.');
    }

    return await Exam.findById(examId)
      .populate('createdBy', 'firstName lastName email')
      .lean();
  }

  /**
   * Fetches all active exams with pagination
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Object} - { exams, total, pages }
   */
  static async getActiveExams(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const now = new Date();

    const query = {
      isEnabled: true,
      $or: [
        { startTime: { $exists: false } },
        { startTime: { $lte: now } },
        { startTime: null }
      ],
      $or: [
        { endTime: { $exists: false } },
        { endTime: { $gte: now } },
        { endTime: null }
      ]
    };

    const exams = await Exam.find(query)
      .populate('createdBy', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Exam.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { exams, total, pages, currentPage: page };
  }

  /**
   * Fetches exam results with pagination
   * @param {Object} filters - { examId, status, page, limit }
   * @returns {Object} - { results, total, pages }
   */
  static async getExamResults(filters = {}) {
    const { examId, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const query = {};
    if (examId && isValidObjectId(examId)) {
      query.examId = examId;
    }
    if (status && ['pass', 'fail'].includes(status)) {
      query.status = status;
    }

    const results = await ExamResult.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ submittedAt: -1 })
      .lean();

    const total = await ExamResult.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { results, total, pages, currentPage: page };
  }

  /**
   * Checks if applicant has passed exam
   * @param {string} applicantId - Applicant ID
   * @param {string} examId - Exam ID (optional - checks any exam if not provided)
   * @returns {Object} - { isPassed: boolean, result: Object }
   */
  static async hasApplicantPassedExam(applicantId, examId = null) {
    if (!isValidObjectId(applicantId)) {
      throw new Error('Invalid applicant ID format.');
    }

    const query = {
      applicantId,
      status: 'pass'
    };

    if (examId && isValidObjectId(examId)) {
      query.examId = examId;
    }

    const result = await ExamResult.findOne(query).lean();
    return { isPassed: !!result, result };
  }
}

module.exports = ExamService;
