const express = require('express');
const {
  checkOverwork,
  checkOverworkByWorker,
  checkOverworkByDateRange
} = require('../controllers/alertController');

const router = express.Router();

// 路由設定
router.get('/overwork', checkOverwork); // 查詢所有超時記錄
router.get('/overwork/:worker_id', checkOverworkByWorker); // 查詢特定員工的超時記錄
router.get('/overwork-range', checkOverworkByDateRange); // 查詢日期範圍內的超時記錄

module.exports = router;