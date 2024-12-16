const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // 資料庫連線配置

const Login = sequelize.define('Login', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    comment: '使用者名稱，可能是船長或漁工的名字'
  },
  worker_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '漁工的員工編號，若為船長則為 NULL'
  },
  pattern: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '九宮格圖形密碼'
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['captain', 'fisherman']]
    },
    comment: '使用者角色，可能是船長 (captain) 或漁工 (fisherman)'
  },
  login_timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '當前登入的時間'
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '上次登入時間，用於檢查是否長期未登入'
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en-US',
    comment: '使用者語言偏好，例如 zh-TW（繁體中文）或 en-US（英文）'
  },
  login_attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '登入失敗次數，用於安全檢查（例如多次失敗後鎖定帳戶）'
  }
}, {
  tableName: 'user_login', // 資料表名稱
  timestamps: false,    // 不會自動生成 createdAt 和 updatedAt 欄位
  comment: '管理所有使用者（船長與漁工）的登入資訊'
});

module.exports = Login;
