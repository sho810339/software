const express = require('express');
const router = express.Router();
const uploadSignature = require('../middlewares/uploadSignature'); // 引入上傳簽名的中介軟體

const { 
    getAllWorker, 
	getMonthlyCalender, 
	signToCheck, 
	reportAbnormality 
} = require('../controllers/workerPageController');


// API 1: 獲取所有船員的基本資訊
router.get('/workers/:worker_id', getAllWorker);

// API 2: 獲取月曆每一天的工作情況
router.get('/calendar/:worker_id/:year/:month', getMonthlyCalender);

// API 3: 簽名確認工作內容
router.post('/oemo', uploadSignature, signToCheck);

// API 4: 提交工作異常報告
router.post('/newReport', reportAbnormality);


module.exports = router;
