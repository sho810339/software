const Worker = require('../models/Worker');

// 新增船員
const addWorker = async (req, res) => {
  const { worker_id, given_name, family_name, age, country, passport_number, job_title } = req.body;
  try {
    const newWorker = await Worker.create({ worker_id, given_name, family_name, age, country, passport_number, job_title });
    res.json({ message: '新增船員成功', newWorker });
  } catch (error) {
    console.error('新增船員失敗:', error.errors || error.message); // 顯示具體錯誤
    res.status(500).json({ error: '無法新增船員' });
  }
};

// 查詢單一船員
const getWorker = async (req, res) => {
  const { id } = req.params;
  try {
    const worker = await Worker.findByPk(id);
    if (!worker) return res.status(404).json({ error: '找不到該船員' });
    res.json(worker);
  } catch (error) {
    console.error('無法查詢船員資料', error.errors || error.message); // 顯示具體錯誤
    res.status(500).json({ error: '無法查詢船員資料' });
  }
};

const getAllWorker = async (req, res) => {
  try {
    const workers = await Worker.findAll(); // 查詢所有船員
    res.json(workers);
  } catch (error) {
    console.error('無法查詢船員資料', error.errors || error.message); // 顯示具體錯誤
    res.status(500).json({ error: '無法查詢船員資料' });
  }
};

module.exports = { addWorker, getWorker, getAllWorker };