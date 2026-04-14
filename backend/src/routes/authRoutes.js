const express = require('express');
const { loginHandler, meHandler } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginHandler);
router.get('/me', authMiddleware, meHandler);

module.exports = router;
