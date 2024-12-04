const express = require('express');
const router = express.Router();

const { 
    getProfile, 
	getWorkersByJobTitle, 
	addWorker, 
	updateWorker, 
	patchWorker, 
	getWorker, 
	deleteWorker
} = require('../controllers/workerEditController');



// api1:查詢所有船員profile
router.get('/profiles', getProfile);

// api2:由工種查詢船員
router.get('/get-by-job', getWorkersByJobTitle);

// api3:新增船員路由
router.post('/add-worker', addWorker);

// api4:編輯員工資料的路由
router.put('/:worker_id', updateWorker);

// api4:更新船員部分資料
router.patch('/:worker_id', patchWorker);

// api5:查詢單一船員所有資料
router.get('/:worker_id', getWorker);

// api6:刪除船員
router.delete('/:worker_id', deleteWorker);


module.exports = router;

