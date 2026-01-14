const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { updateUserName } = require('../controllers/userController');

router.put('/me', authMiddleware, updateUserName);


module.exports = router;
