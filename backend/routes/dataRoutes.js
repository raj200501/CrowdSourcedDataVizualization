const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/upload', dataController.uploadData);
router.post('/clean/:id', dataController.cleanData);

module.exports = router;
