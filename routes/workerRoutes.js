const express = require('express');
const { addWorker, getWorker } = require('../controllers/workerController');

const router = express.Router();

// 新增船員路由
router.post('/', addWorker);

// 查詢單一船員路由
router.get('/:id', getWorker);

// 查詢所有船員
router.get('/', async (req, res) => {
    try {
      const workers = await Worker.findAll(); // 查詢所有船員
      res.json(workers);
    } catch (error) {
      res.status(500).json({ error: '無法查詢船員資料' });
    }
  });

module.exports = router;

