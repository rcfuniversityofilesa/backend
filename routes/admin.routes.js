const express = require('express')
const router = express.Router()

const { adminregister, adminLogin, getProfile, updateProfilePost } = require('../controllers/admin.controller')

const { createProgramPost, createNewsPost, getPublishedProgrammes, getPublishedNews, publishHymn, getPublishedHymns } = require('../controllers/post.controller')

const { deleteAppliedWorker, deleteNews, deleteProgram, deleteHymn } = require('../controllers/delete.controller')

const { updateNews, updateProgram, updateHymn } = require('../controllers/update.controller')


const verifyToken = require('../middleware/verifyToken')
const upload = require('../middleware/upload')
const generatePDF = require('../utils/generateWorkerPDF')
const requireRole = require('../middleware/requireRole')
const validateObjectId = require('../middleware/validateObjectId')
const validateExamSubmission = require('../middleware/validateExamSubmission')

const { createExam, updateExam, toggleExamStatus, getAllExams, getResults, submitExam } = require('../controllers/exam.controller')
const { createInterview } = require('../controllers/interview.controller')



router.post('/reg', adminregister);

router.post('/login', adminLogin);

router.get('/profile/me', verifyToken, getProfile);

router.delete('/delete/appliedWorker/:id', deleteAppliedWorker)

router.post('/post/news', upload.single("newsImage"), createNewsPost);

router.get('/published/news', getPublishedNews)

router.delete('/delete/news/:id', deleteNews)

router.put("/update/news/:id", upload.single("programImage"), updateNews);

router.post('/post/program', upload.single("programImage"), createProgramPost);

router.get('/published/programmes', getPublishedProgrammes)

router.delete('/delete/program/:id', deleteProgram)

router.put("/update/program/:id", upload.single("programImage"), updateProgram);

router.post('/post/hymn', publishHymn);

router.get('/published/hymns', getPublishedHymns)

router.delete('/delete/hymn/:id', deleteHymn)

router.put("/update/hymn/:id", updateHymn);

// Workers In Training Exam routes (protected)
router.post('/exam/create', verifyToken, requireRole('workersInTraining'), createExam);
router.put('/exam/update/:id', verifyToken, requireRole('workersInTraining'), updateExam);
router.put('/exam/toggle/:id', verifyToken, requireRole('workersInTraining'), toggleExamStatus);
router.get('/exam', verifyToken, requireRole('workersInTraining'), getAllExams);
router.get('/exam/results', verifyToken, requireRole('workersInTraining'), submitExam);

// Submission endpoint (admins with workersInTraining role submit on behalf or accept POSTs)
router.post('/exam/submit', verifyToken, requireRole('workersInTraining'), validateExamSubmission, submitExam);

// Move to interview (ensure exam result exists)
router.post('/interview/:applicantId', verifyToken, requireRole('workersInTraining'), validateObjectId('applicantId'), createInterview);

router.put("/update/admin/me", verifyToken, upload.single("passport"), updateProfilePost);



module.exports = router