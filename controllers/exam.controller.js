const mongoose = require('mongoose');
const examModel = require('../models/exam.model');
const examResultModel = require('../models/examResult.model');
const workersFormModel = require('../models/workersForm.model');
const ExamService = require('../services/exam.service');

const isValidObjectId = mongoose.Types.ObjectId.isValid;

/*
CREATE EXAM
*/
exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      duration,
      passMark,
      startTime,
      endTime
    } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0 || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Title, questions and duration are required.'
      });
    }

    const newExam = await examModel.create({
      title,
      description,
      questions,
      duration,
      passMark: passMark || 50,
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      createdBy: req.adminId,
      isEnabled: true
    });

    res.status(201).json({
      success: true,
      message: 'Exam created successfully.',
      data: {
        examId: newExam._id,
        title: newExam.title,
        totalQuestions: newExam.questions.length,
        duration: newExam.duration,
        passMark: newExam.passMark
      }
    });


  } catch (error) {
    console.error('Create Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating exam.',
      error: error.message
    });
  }
};

/*
UPDATE EXAM
*/
exports.updateExam = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!isValidObjectId(examId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID.'
      });
    }

    const exam = await examModel.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.'
      });
    }

    const hasResults = await examResultModel.exists({ examId });
    if (hasResults) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update exam after submissions.'
      });
    }

    const {
      title,
      description,
      questions,
      duration,
      passMark,
      startTime,
      endTime
    } = req.body;

    if (title) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (Array.isArray(questions)) exam.questions = questions;
    if (duration) exam.duration = duration;
    if (passMark !== undefined) exam.passMark = passMark;
    if (startTime) exam.startTime = new Date(startTime);
    if (endTime) exam.endTime = new Date(endTime);

    await exam.save();

    res.json({
      success: true,
      message: 'Exam updated successfully.',
      data: {
        examId: exam._id,
        title: exam.title,
        totalQuestions: exam.questions.length,
        passMark: exam.passMark
      }
    });


  } catch (error) {
    console.error('Update Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating exam.',
      error: error.message
    });
  }
};

/*
TOGGLE EXAM STATUS
*/
exports.toggleExamStatus = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!isValidObjectId(examId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID.'
      });
    }

    const exam = await examModel.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.'
      });
    }

    exam.isEnabled = !exam.isEnabled;
    await exam.save();

    res.json({
      success: true,
      message: `Exam ${exam.isEnabled ? 'enabled' : 'disabled'} successfully.`,
      data: {
        examId: exam._id,
        isEnabled: exam.isEnabled
      }
    });


  } catch (error) {
    console.error('Toggle Exam Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling exam status.',
      error: error.message
    });
  }
};

/*
GET ALL EXAMS
*/
exports.getAllExams = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.enabled === 'true') query.isEnabled = true;
    if (req.query.enabled === 'false') query.isEnabled = false;

    const [exams, total] = await Promise.all([
      examModel.find(query)
        .populate('createdBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      examModel.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        exams: exams.map(e => ({
          id: e._id,
          title: e.title,
          description: e.description,
          totalQuestions: e.questions?.length || 0,
          duration: e.duration,
          passMark: e.passMark,
          isEnabled: e.isEnabled,
          startTime: e.startTime,
          endTime: e.endTime,
          totalAttempts: e.totalAttempts || 0,
          totalPassed: e.totalPassed || 0,
          totalFailed: e.totalFailed || 0,
          createdBy: e.createdBy,
          createdAt: e.createdAt
        })),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          limit
        }
      }
    });


  } catch (error) {
    console.error('Get All Exams Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exams.',
      error: error.message
    });
  }
};

/*
SUBMIT EXAM
*/
exports.submitExam = async (req, res) => {
  try {
    const { examId, applicantId, answers } = req.body;

    if (!isValidObjectId(examId) || !isValidObjectId(applicantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID or applicant ID.'
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answers must be provided.'
      });
    }

    const validation = await ExamService.validateExamTakeable(examId, applicantId);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const exam = await examModel.findById(examId).select(
      'title questions passMark duration'
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.'
      });
    }

    const applicant = await workersFormModel.findById(applicantId).select(
      'fullName email phoneNumber'
    );

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found.'
      });
    }

    const gradeResult = ExamService.gradeExam(exam, answers);

    const savedResult = await ExamService.saveExamResult({
      examId,
      applicantId,
      fullName: applicant.fullName,
      email: applicant.email,
      phoneNumber: applicant.phoneNumber,
      answers,
      score: gradeResult.score,
      totalQuestions: gradeResult.totalQuestions,
      correctAnswers: gradeResult.correctAnswers,
      status: gradeResult.status,
      duration: exam.duration
    });

    res.status(201).json({
      success: true,
      message: 'Exam submitted successfully.',
      data: {
        resultId: savedResult._id,
        score: savedResult.score,
        totalQuestions: savedResult.totalQuestions,
        correctAnswers: savedResult.correctAnswers,
        status: savedResult.status,
        passMark: exam.passMark
      }
    });


  } catch (error) {
    console.error('Submit Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting exam.',
      error: error.message
    });
  }
};