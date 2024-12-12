require('dotenv').config();  // 載入 .env 檔案
const { Sequelize } = require('sequelize');
const fs = require('fs');

// const host = process.env.DB_HOST || 'localhost';  // 本地開發環境默認為 localhost，生產環境需設置為遠端 IP
// const dbName = process.env.DB_NAME || 'fisherman'; // 資料庫名稱
// const dbUser = process.env.DB_USER || 'root';     // 用戶名
// const dbPassword = process.env.DB_PASSWORD || 'password'; // 密碼/ // 使用環境變數來區分開發和生產環境

// 使用環境變數來區分開發和生產環境
const host = 'localhost';  // 本地開發環境默認為 localhost，生產環境需設置為遠端 IP
const dbName = 'fisherman'; // 資料庫名稱
const dbUser = 'root';     // 用戶名
const dbPassword = 'password'; // 密碼

// 建立資料庫連線
// fisherman / root / password 分別改成自己所設定的資料庫名稱/帳號/密碼
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: host,        // 資料庫主機位址
  dialect: 'mysql',         // 使用 MySQL 資料庫
  logging: false,           // 關閉 Sequelize 的 SQL 日誌（選填）
  pool: {                   // 連線池設定（選填）
    max: 5,                 // 最大連線數
    min: 0,                 // 最小連線數
    acquire: 30000,         // 連線超時時間（毫秒）
    idle: 10000             // 釋放連線的閒置時間（毫秒）
  }
});
// 初始化資料庫
async function initializeDatabase(sqlFilePath) {
  try {
    console.log('嘗試建立資料庫...');

    // 先建立初始連線到 MySQL
    await sequelize.authenticate();
    console.log('資料庫連線成功！');

    // 創建資料庫（如果尚未存在）
    await sequelize.query('CREATE DATABASE IF NOT EXISTS fisherman');
    console.log('資料庫已創建或已存在');

    // 重新連接到剛創建的 'fisherman' 資料庫
    const sequelizeNew = new Sequelize(dbName, dbUser, dbPassword, {
      host: host,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    // 讀取並執行 SQL 文件來創建資料表
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');
    const statements = sql.split(';').map(stmt => stmt.trim()).filter(Boolean);
    
    for (const statement of statements) {
      await sequelizeNew.query(statement);
    }

    console.log('資料庫初始化完成！');
  } catch (error) {
    console.error('資料庫初始化失敗:', error);
    throw error;
  }
}

// 插入初始資料
async function seedInitialData() {
  try {
    const Worker = require('../models/crew_members'); // 假設您有 crew_members 模型

    const initialWorkers = [
      {
        worker_id: 0,
        name: 'Captain Jack',
        age: 40,
        country: 'USA',
        passport_number: 'A12345678',
        job_title: 'captain',
        profilePhoto: 'uploads\\profile\\captain.jpg',
      },
    ];

      for (const worker of initialWorkers) {
        await Worker.findOrCreate({
          where: { passport_number: worker.passport_number },
          defaults: worker,
        });
      }
      console.log('初始資料插入成功！');
    } catch (error) {
      console.error('插入初始資料失敗:', error);
  }
}

module.exports = { sequelize, initializeDatabase, seedInitialData };