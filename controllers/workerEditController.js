const { sequelize } = require('../config/database'); 
const Worker = require('../models/crew_members');
const Login = require('../models/user_login');
const { Op } = require('sequelize');

// api1()：查詢船員簡易資訊
const getProfile = async (req, res) => {
  try {
    // 查詢所有船員的簡易資料（worker_id, name, profilePhoto）
    const workers = await Worker.findAll({
      attributes: ['worker_id', 'name', 'profilePhoto'],
      where: {
	      worker_id:{
		      [Op.ne]: 0,
	      },
      },
    });
    

    // 如果查詢結果為空，返回 404 錯誤，並提供更多錯誤資訊
    if (workers.length === 0) {
      return res.status(404).json({
        error: '沒有找到任何船員資料',
        message: '請檢查資料庫中是否有船員資料，或者檢查查詢條件是否正確。',
      });
    }

    // 返回查詢到的簡易船員資料
    res.json(workers);

  } catch (error) {
    console.error('無法查詢船員資料', error.errors || error.message); // 顯示具體錯誤
    res.status(500).json({
      error: '無法查詢船員資料',
      details: '請檢查資料庫連線是否正常，或者查詢條件是否正確。'
    });
  }
};


// api2：由工種查詢船員
const getWorkersByJobTitle = async (req, res) => {
  try {
    const { job_title } = req.query; // 從查詢參數中獲取工種

    // 如果沒有提供工種參數，返回 400 錯誤
    if (!job_title) {
      return res.status(400).json({
        error: '請提供工種參數',
        message: '缺少必要的查詢條件:job_title。請在查詢參數中提供工種。',
      });
    }

    // 查詢工種為指定 job_title 的船員資料
    const workers = await Worker.findAll({
      attributes: ['worker_id', 'name', 'profilePhoto', 'job_title'], // 限制返回的欄位
      where: { job_title }, // 篩選條件，查詢指定工種的員工
    });

    // 如果沒有找到符合條件的船員，返回 404 錯誤
    if (workers.length === 0) {
      return res.status(404).json({
        error: `找不到工種為 "${job_title}" 的員工資料`,
        message: `請檢查工種 "${job_title}" 是否正確，或者資料庫中是否有符合條件的員工。`,
      });
    }

    // 返回查詢結果
    res.json({
      message: `成功查詢工種為 "${job_title}" 的船員資料`,
      workers,
    });

  } catch (error) {
    console.error('無法查詢船員資料', error.errors || error.message); // 顯示錯誤訊息
    res.status(500).json({
      error: '無法查詢船員資料',
      details: '請檢查資料庫連線是否正常，或檢查查詢參數是否正確。'
    });
  }
};

// api3：新增員工
const addWorker = async (req, res) => {
  const { name, age, country, passport_number, job_title, pattern } = req.body;
  console.log(req.body);
  const profilePhoto = req.file ? req.file.path : null; // 上傳文件的路徑
  if (Array.isArray(req.body)) {
    return res.status(400).json({
      error: '請提供單一物件，而非陣列',
      details: 'API 僅支援一次處理一個員工資料。請勿傳送陣列。',
    });
  }

  // 驗證輸入資料
  if (!name || !age || !country || !passport_number || !job_title || !pattern) {
    return res.status(400).json({
      error: '缺少必要的字段',
      missingFields: {
        name: !name,
        age: !age,
        country: !country,
        passport_number: !passport_number,
        job_title: !job_title,
        pattern: !pattern,
      },
    });
  }

  // 定義有效的 job_title 選項
  const validJobTitles = ['engineer', 'fisherman', 'fish processor', 'deckhand', 'chef'];
  
  // 檢查傳入的 job_title 是否有效
  if (job_title && !validJobTitles.includes(job_title)) {
    return res.status(400).json({
      error: '無效的工種',
      message: `傳入的工種 "${job_title}" 並不在可選工種列表中。有效工種為: ${validJobTitles.join(', ')}`,
    });
  }

  try {
    // 檢查護照號碼是否唯一
    const existingWorker = await Worker.findOne({ where: { passport_number } });
    if (existingWorker) {
      return res.status(400).json({
        error: '護照號碼已存在',
        passport_number: passport_number
      });
    }

    // 找到目前最大的 worker_id
    const maxWorker = await Worker.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('worker_id')), 'maxWorkerId']],
      raw: true,
    });

    const newWorkerId = (maxWorker.maxWorkerId || 0) + 1;

    // 新增 Worker
    const newWorker = await Worker.create({
        worker_id: newWorkerId,
        name,
        age,
        country,
        passport_number,
        job_title,
        profilePhoto,
    });
    // 新增對應的 UserLogin
    const newAccount = await Login.create({
        username: name,
        worker_id: newWorkerId,
        pattern: pattern, // 假設 password 欄位用於存儲九宮格密碼
        role: 'fisherman', // 默認角色為 worker
    });
    
    res.json({ message: '新增船員帳號成功', newWorker, newAccount });
    

  } catch (error) {
    console.error('新增船員失敗:', error.errors || error.message); // 顯示具體錯誤
    
    if (error.name === 'SequelizeValidationError') {
      // 如果是資料庫驗證錯誤，返回更具體的錯誤信息
      return res.status(400).json({
        error: '資料庫驗證錯誤',
        details: error.errors.map(err => ({
          message: err.message,
          field: err.path
        }))
      });
    } else {
      // 其他未知錯誤
      return res.status(500).json({
        error: '無法新增船員',
        message: error.message
      });
    }
  }
};

// api4：編輯船員部分資料
const patchWorker = async (req, res) => {
  const { worker_id } = req.params; // 獲取 URL 中的 worker_id
  const updates = req.body; // 從請求主體中獲取需要更新的數據

  if (req.file) {
    updates.profilePhoto = req.file.path; // 使用 Multer 上傳後的文件路徑
  }
	
  //檢查更新數據是否為空
  if (!Object.keys(req.body).length) {
    return res.status(400).json({
      error: '請提供更新的數據',
      details: '請求體中沒有提供需要更新的字段。'
    });
  }

  // 定義可以更新的字段，防止其他不必要的字段被更新
  const allowedFields = ['name', 'age', 'country', 'passport_number', 'job_title', 'profilePhoto', 'pattern'];

  // 過濾掉不允許的字段
  const filteredUpdates = {};
  for (let key in updates) {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    } else {
      console.warn(`嘗試更新不允許的字段: ${key}`); // 輸出警告訊息
    }
  }

  // 如果過濾後沒有任何合法的字段
  if (!Object.keys(filteredUpdates).length) {
    return res.status(400).json({
      error: '所有提供的字段都不允許更新',
      details: '請檢查您提供的字段，並確保它們是有效的更新字段。'
    });
  }


  try {
    // 檢查員工是否存在
    const worker = await Worker.findByPk(worker_id);
    if (!worker) {
      return res.status(404).json({
        error: '找不到該員工，無法更新',
        worker_id: worker_id,  // 顯示查詢的 worker_id 讓開發者知道是哪一個員工找不到
      });
    }

    //區別是要改worker還login
    const loginUpdates = {};
    const workerUpdates = {};
    for (let key in filteredUpdates) {
      if (key === 'pattern') {
        loginUpdates[key] = filteredUpdates[key];
      } else {
        workerUpdates[key] = filteredUpdates[key];
      }
    }

    // 更新員工的部分資料
    if (Object.keys(workerUpdates).length) {
      await Worker.update(workerUpdates, {
        where: { worker_id },
      });
    }
    
    if (Object.keys(loginUpdates).length) {
      await Login.update(loginUpdates, {
        where: { worker_id },
      });
    }

    // 返回成功響應，並可選擇重新查詢更新後的數據返回
    const updatedWorker = await Worker.findByPk(worker_id);
    const updatedLogin = await Login.findOne({ where: { worker_id } });
    res.status(200).json({
      message: `員工 ID 為 ${worker_id} 的資料已成功更新`,
      worker: updatedWorker,
      login: updatedLogin,
    });

  } catch (error) {
    console.error('更新員工資料失敗', error.errors || error.message); // 錯誤日誌

    if (error.errors) {
      return res.status(400).json({
        error: '資料庫錯誤',
        details: error.errors.map(err => ({
          message: err.message,
          field: err.path,  // 錯誤對應的字段
          type: err.type    // 錯誤的類型，例如：notNull Violation
        }))
      });
    }
    res.status(500).json({ error: '無法更新員工資料' });
  }
};


// api5：查詢單一船員
const getWorker = async (req, res) => {
  const { worker_id } = req.params;

  // 檢查 worker_id 是否為有效的數字
  if (!/^\d+$/.test(worker_id)) {
    return res.status(400).json({
      error: 'worker_id 無效',
      message: `傳入的 worker_id (${worker_id}) 不是有效的數字，請確認輸入是否正確。`,
    });
  }

  try {
    const worker = await Worker.findByPk(worker_id);
    // const worker = await Login.findOne({
    //   where: { worker_id: worker_id },
    //   attributes: ['pattern'], // 只選擇需要的欄位
    //   raw: true
    // });
    
    // 如果查不到船員，返回 404
    if (!worker) {
      return res.status(404).json({
        error: '找不到該船員',
        message: `員工 ID ${worker_id} 不存在於資料庫中。請確認輸入的 ID 是否正確。`,
      });
    }

    // 組合返回資料，包含 Worker 和 pattern
    const result = {
     worker_id: worker.worker_id,
     name: worker.name,
     age: worker.age,
     country: worker.country,
     passport_number: worker.passport_number,
     job_title: worker.job_title,
     profilePhoto: worker.profilePhoto
    };

    res.json(result);

  } catch (error) {
    console.error('無法查詢船員資料', error.errors || error.message); // 顯示具體錯誤
    res.status(500).json({
      error: '無法查詢船員資料',
      details: '請檢查資料庫連線是否正常，或查詢參數是否有效。'
    });
  }
};


// api6：刪除船員
const deleteWorker = async (req, res) => {
  const { worker_id } = req.params; // 獲取 URL 中的 worker_id

  try {
    const worker = await Worker.findByPk(worker_id); // 檢查該船員是否存在

    if (!worker) {
      // 如果找不到該船員，回傳 404 錯誤
      return res.status(404).json({
        error: '找不到該船員，無法刪除',
        message: `未找到編號為 ${worker_id} 的船員。請檢查 ID 是否正確，或者該船員是否已經被刪除。`,
      });
    }

    // 嘗試刪除該船員
    const deletedRows = await Worker.destroy({
      where: { worker_id }, // 使用條件刪除該船員
    });

    // 如果刪除失敗
    if (deletedRows === 0) {
      return res.status(400).json({
        error: '刪除失敗',
        message: `未能成功刪除工號為 ${worker_id} 的船員資料，請確保資料庫設置正確，並重試。`,
      });
    }

    // 刪除成功
    res.status(200).json({
      message: `船員 ID 為 ${worker_id} 的資料已成功刪除`,
    });

  } catch (error) {
    console.error('刪除船員失敗', error.errors || error.message); // 錯誤日誌
    res.status(500).json({
      error: '無法刪除船員資料',
      message: `請稍後再試，若問題持續，請聯繫系統管理員，並查看伺服器日誌以獲得更多錯誤資訊。`,
    });
  }
};


module.exports = { 
	getProfile, 
	getWorkersByJobTitle, 
	addWorker,  
	patchWorker, 
	getWorker, 
	deleteWorker
};
