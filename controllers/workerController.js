const Worker = require('../models/Worker');

// 新增船員
const addWorker = async (req, res) => {
  const { worker_id, given_name, family_name, age, country, passport_number, job_title } = req.body;
  try {
    const newWorker = await Worker.create({ worker_id, given_name, family_name, age, country, passport_number, job_title });
    res.json({ message: '新增船員成功', newWorker });
  } catch (error) {
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
    res.status(500).json({ error: '無法查詢船員資料' });
  }
};

module.exports = { addWorker, getWorker };