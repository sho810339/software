const { Op } = require('sequelize');
const Report = require('../models/report');
const Worker = require('../models/crew_members');
const Attendance = require('../models/work_hours');
const { createReportNotification } = require('./CTManagementPageController');

// API 1: 獲取所有船員的基本資訊
const getAllWorker = async (req, res) => {
  try {
    const workers = await Worker.findAll();
    res.json(workers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '取得船員資訊失敗' });
  }
};

/*
const getAllWorker = async (req, res) => {
    try {
      const workers = await Worker.findAll({
        attributes: ['worker_id', 'name', 'age', 'country', 'passport_number', 'job_title', 'worker_pic'], // 可以根據需求選擇返回欄位
      });
      res.json(workers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '取得船員資訊失敗' });
    }
};
*/


// API 2: 獲取月曆每一天的工作情況
const getMonthlyCalender = async (req, res) => {
  const { worker_id, year, month } = req.params;

  // 檢查參數
  if (!worker_id || !year || !month) {
    return res.status(400).json({ message: '缺少必要的參數' });
  }

  try {
    // 查詢特定員工在某年某月的所有報告
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(year, month - 1, 0); // 這個月的最後一天
    const endDate = `${year}-${month}-${lastDay.getDate()}`; // 取得該月的最後一天日期

    const calendar = await Attendance.findAll({
      where: {
        worker_id,
        date: {
          [Op.between]: [startDate, endDate],  // 選擇該月的所有日期
        }
      },
      attributes: ['date', 'duration', 'status', 'worker_id'],
    });

    res.json(calendar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '獲取工作情況失敗' });
  }
};

// API 3: 簽名確認工作內容
const signToCheck = async (req, res) => {
  const { worker_id, date, signature } = req.body;

  // 檢查參數
  if (!worker_id || !date || !signature) {
    return res.status(400).json({ message: '缺少必要的參數', status: 0 });
  }

  try {
    // 找到指定日期的報告
    const oemo = await Attendance.findOne({
      where: {
        worker_id,
        date,
      },
    });

    if (!oemo) {
      return res.status(404).json({ message: '找不到該日期的報告', status: 0 });
    }

    // 更新報告的簽名
    oemo.signaturePhoto = signature;
    oemo.check = true;
    await oemo.save();

    res.json({ message: '工作內容已確認', status: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '簽名確認失敗', status: 0 });
  }
};

// API 4: 提交工作異常報告
const reportAbnormality = async (req, res) => {
  const { worker_id, date, issue_description, check = 0 } = req.body;

  // 檢查參數
  if (!worker_id || !date || !issue_description) {
    return res.status(400).json({ message: '缺少必要的參數', status: 0 });
  }

  try {
    // 創建新的異常報告
    const newReport = await Report.create({
      worker_id,
      date,
      issue_description,
      check
    });
    // 呼叫 createReportNotification 函數來創建通知
    await createReportNotification(worker_id, issue_description);

    res.status(201).json({ message: '異常報告已提交', data: newReport, status: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '提交異常報告失敗', status: 0 });
  }
};

module.exports = {
  getAllWorker,
  getMonthlyCalender,
  signToCheck,
  reportAbnormality
};
