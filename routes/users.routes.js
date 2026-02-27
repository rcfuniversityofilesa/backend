const express = require('express');
const router = express.Router()


const { sendUserMessages, getUserMessages, getAppliedWorker, getAppliedWorkerId } = require('../controllers/users.controller');

const { adminReplyUsersMessages, markMessageSeen, getRepliedMessages } = require('../controllers/admin.controller');

const { deleteRepliedMessageFromView } = require('../controllers/delete.controller');


const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload')
const generatePDF = require('../utils/generateWorkerPDF')


router.post("/apply/workforce",  upload.single("passport"), generatePDF);

router.get('/apply/workforce/getdetails', getAppliedWorker);

router.get('/apply/workforce/getdetails/:id', getAppliedWorkerId);

router.post('/message', sendUserMessages);

router.get('/get/message', getUserMessages)

router.post('/admin/reply', adminReplyUsersMessages)

router.put('/message/seen/:id', markMessageSeen)

router.get('/get/message/replied', verifyToken, getRepliedMessages)

router.delete('/get/message/replied/delete/:id', deleteRepliedMessageFromView)



module.exports = router