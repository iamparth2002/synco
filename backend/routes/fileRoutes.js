const express = require('express');
const router = express.Router();
const { getFiles, getFileContent, createFile, updateFile, deleteFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFiles).post(protect, createFile);
router.route('/:id').get(protect, getFileContent).put(protect, updateFile).delete(protect, deleteFile);

module.exports = router;
