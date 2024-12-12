const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // 載入資料庫配置

const Worker = sequelize.define('Worker', {
  worker_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // 必填
    unique: true, // 確保唯一
    comment: '員工編號',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // 必填
    validate: {
      notEmpty: true, // 不允許空字串
    },
    comment: '姓名',
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false, // 必填
    validate: {
      isInt: true, // 年齡要是整數
      min: 0, // 年齡不得小於 0
    },
    comment: '年齡',
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false, // 必填
    validate: {
      notEmpty: true,
    },
    comment: '國籍',
  },
  passport_number: {
    type: DataTypes.STRING,
    allowNull: false, // 必填
    unique: true, // 確保唯一
    comment: '護照號碼',
  },
  job_title: {
    type: DataTypes.ENUM('engineer', 'fisherman', 'fish processor', 'deckhand', 'chef', 'captain'),
    allowNull: false, // 必填
    comment: '工種',
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '照片的文件路徑'
  },
}, {
  tableName: 'crew_members', // 資料表名稱
  timestamps: false, // 自動生成 createdAt 和 updatedAt 欄位
});

module.exports = Worker;
