const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // 載入資料庫配置

const Report = sequelize.define('Report', {
  report_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // 必填
    comment: '編號，自動產生',
  },
  check: {
    type: DataTypes.INTEGER,
    allowNull: false, // 必填
    validate: {
      isIn: [[0, 1]], // 僅允許 0 或 1
    },
    comment: '確認狀態，成功（1）或失敗（0）',
  },
  worker_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // 必填
    comment: '員工編號，用於查詢特定船員',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false, // 必填
    comment: '報告日期',
  },
  issue_description: {
    type: DataTypes.STRING,
    allowNull: false, // 必填
    comment: '異常描述，問題詳細描述',
  },
}, {
  tableName: 'report', // 資料表名稱
  timestamps: true, // 自動生成 createdAt 和 updatedAt 欄位
});

module.exports = Report;
