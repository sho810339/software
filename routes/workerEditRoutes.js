const express = require('express');
const router = express.Router();
const uploadProfile = require('../middlewares/uploadProfile'); // 引入上傳中間件
const convertImage = require('../middlewares/convertImage');

const { 
    getProfile, 
	getWorkersByJobTitle, 
	addWorker, 
	patchWorker, 
	getWorker, 
	deleteWorker
} = require('../controllers/workerEditController');



// api1:查詢所有船員profile
router.get('/profiles', getProfile);

// api2:由工種查詢船員
router.get('/get-by-job', getWorkersByJobTitle);

// api3:新增船員路由
router.post('/add-worker', uploadProfile.single('profilePhoto'), convertImage, addWorker);

// api4:更新船員部分資料
router.patch('/:worker_id', uploadProfile.single('profilePhoto'), patchWorker);

// api5:查詢單一船員所有資料
router.get('/:worker_id', getWorker);

// api6:刪除船員
router.delete('/:worker_id', deleteWorker);


module.exports = router;

