const express = require('express');
const { captainLogin, addWorkLog, viewWorkLogs } = require('../controllers/captainController'); // 引入控制器
const router = express.Router();

// 船長登入
router.post('/login', captainLogin);

// 新增工作記錄
router.post('/worklog', addWorkLog);

// 查看指定船員的工作記錄
router.get('/worker/:workerId/worklogs', viewWorkLogs);

module.exports = router;
