const express = require('express');
const { addWorker, getWorker, getAllWorker } = require('../controllers/workerController');

const router = express.Router();

// 新增船員路由
router.post('/', addWorker);

// 查詢單一船員路由
router.get('/:id', getWorker);

// 查詢所有船員
router.get('/', getAllWorker);

module.exports = router;

