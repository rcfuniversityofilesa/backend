const express = require('express')
const router = express.Router()


const { adminregister, adminLogin, getProfile, updateProfilePost } = require('../controllers/admin.controller')

const { createProgramPost, createNewsPost, getPublishedProgrammes, getPublishedNews, publishHymn, getPublishedHymns } = require('../controllers/post.controller')

const { deleteAppliedWorker, deleteNews, deleteProgram, deleteHymn } = require('../controllers/delete.controller')

const { updateNews, updateProgram, updateHymn } = require('../controllers/update.controller')


const verifyToken = require('../middleware/verifyToken')
const upload = require('../middleware/upload')
const generatePDF = require('../utils/generateWorkerPDF')



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

router.put("/update/admin/:id", upload.single("passport"), updateProfilePost);



module.exports = router