const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // 載入資料庫配置

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // 必填
    comment: '狀態編號，自動生成',
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false, // 必填
    comment: '通知的具體內容',
  },
  type: {
    type: DataTypes.ENUM('System Notification', 'Warning', 'Reminder'),
    allowNull: true, // 非必填
    defaultValue: 'Reminder', // 預設值
    comment: '通知類型',
  },
  status: {
    type: DataTypes.ENUM('Unread', 'Read'),
    allowNull: true, // 非必填
    defaultValue: 'Unread', // 預設值
    comment: '通知的狀態',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false, // 必填
    defaultValue: DataTypes.NOW, // 預設為目前時間
    comment: '通知建立時間',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true, // 非必填
    comment: '通知最後更新時間',
  },
}, {
  tableName: 'notification', // 資料表名稱
  timestamps: true, // 自動生成 createdAt 和 updatedAt 欄位
});

module.exports = Notification;
