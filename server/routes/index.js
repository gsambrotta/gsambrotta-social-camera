const express = require('express')
const router = express.Router()
const awsController = require('../controllers/awsController')

router.post('/api/get-presigned-url', awsController.getPresignedUrl)
router.post('/api/put-presigned-url', awsController.putPresignedUrl)

module.exports = router
