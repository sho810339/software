const express = require('express');
const { captainLogin, addWorkLog, viewWorkLogs } = require('../controllers/captainController'); // 引入控制器
const router = express.Router();

const isCaptain = (req, res, next) => {
    if (!req.user || req.user.role !== 'captain') {
      return res.status(403).json({ error: '只有船長才能執行此操作' });
    }
    next(); // 繼續執行後續控制器邏輯
};

// 船長登入
router.post('/login', captainLogin);

// 新增工作記錄
router.post('/worklog', authenticate, isCaptain, addWorkLog);

// 查看指定船員的工作記錄
router.get('/worker/:workerId/worklogs', authenticate, isCaptain, viewWorkLogs);

module.exports = router;
