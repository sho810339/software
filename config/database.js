const { Sequelize } = require('sequelize');

// 建立資料庫連線
// fisherman / root / password 分別改成自己所設定的資料庫名稱/帳號/密碼
const sequelize = new Sequelize('fisherman', 'root', 'password', {
  host: 'localhost',        // 資料庫主機位址
  dialect: 'mysql',         // 使用 MySQL 資料庫
  logging: false,           // 關閉 Sequelize 的 SQL 日誌（選填）
  pool: {                   // 連線池設定（選填）
    max: 5,                 // 最大連線數
    min: 0,                 // 最小連線數
    acquire: 30000,         // 連線超時時間（毫秒）
    idle: 10000             // 釋放連線的閒置時間（毫秒）
  }
});

module.exports = sequelize;
