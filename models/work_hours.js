const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // 載入資料庫配置

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true, // 設定為自動增長
    comment: '自增 ID'
  },
  worker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '員工編號',
    primaryKey: true // 設定為複合主鍵的一部分
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '日期',
    primaryKey: true // 設定為複合主鍵的一部分
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '000000000000000000000000000000000000000000000000', // 設置預設值為 48 個 0
    comment: '24小時內每個時段的狀態，0=休息 1=工作 2=吃飯'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '工作了幾個半小時'
  },
  profilePhoto: {  
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '放大頭照'
  },
  signaturePhoto: {  
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '放簽名照片'
  },
  check: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    comment: '漁工是否已經確認'
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '備註'
  }
}, {
  tableName: 'work_hours', // 指定資料表名稱
  timestamps: false,
  primaryKey: ['worker_id', 'date'], // 使用複合主鍵
  hooks: {
    beforeUpdate: (attendance) => {
      // 同步更新時也重新計算 status 字串中 '1' 的數量
      if (attendance.status != null) {
        // 計算 status 字串中 '1' 的數量
        const onesCount = (attendance.status.match(/1/g) || []).length;
        attendance.duration = onesCount;  // 將計算結果存儲在 `statusCount` 欄位中
      } else {
        attendance.duration = 0;  // 如果 status 是 null，則將 statusCount 設為 0
      }
    },
  },
});

module.exports = Attendance;

