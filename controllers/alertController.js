// 這是有DailyWorkHours的表的版本

// const { Sequelize } = require('sequelize');
// const DailyWorkHours = require('../models/DailyWorkHours'); //引入 DailyWorkHours 模型

// 模擬資料庫記錄
const mockData = [
  { worker_id: 123, date: '2024-11-22', total_hours: 15.5 },
  { worker_id: 124, date: '2024-11-23', total_hours: 16.0 },
];


// 工時超時檢查
const checkOverwork = async (req, res) => {
    try {
      const overworkAlerts = await DailyWorkHours.findAll({
        where: {
          total_hours: { [Sequelize.Op.gt]: 14 } // 查找總工時超過 14 小時的記錄
        }
      });
  
      res.json({
        message: '以下為超時記錄',
        alerts: overworkAlerts.map(record => ({
          worker_id: record.worker_id,
          date: record.date,
          total_hours: record.total_hours
        }))
      });
    } catch (error) {
      res.status(500).json({ error: '無法檢查超時記錄' });
    }
  };

// 查詢指定日期範圍內的超時記錄
const checkOverworkByDateRange = async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // 從查詢參數取得日期範圍
      const records = DailyWorkHours.findAll = async () => mockData;
      // const records = await DailyWorkHours.findAll({
      //   where: {
      //     date: {
      //       [Sequelize.Op.between]: [startDate, endDate]
      //     },
      //     total_hours: { [Sequelize.Op.gt]: 14 }
      //   }
      // });
  
      if (records.length === 0) {
        return res.json({ message: '指定日期範圍內無超時記錄' });
      }
  
      res.json({
        message: '以下為指定日期範圍內的超時記錄',
        alerts: records.map(record => ({
          worker_id: record.worker_id,
          date: record.date,
          total_hours: record.total_hours
        }))
      });
    } catch (error) {
      res.status(500).json({ error: '無法查詢指定日期範圍的超時記錄' });
    }
};

module.exports = {
    checkOverwork,
    checkOverworkByWorker,
    checkOverworkByDateRange
};