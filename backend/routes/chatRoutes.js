const express = require('express');
const router = express.Router();
const { chatWithGPT } = require('../controllers/chatController');

// POST /api/chat
router.post('/', chatWithGPT);

module.exports = router;
