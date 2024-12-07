const { Sequelize } = require('sequelize');

// 設置 SQLite 資料庫
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // SQLite 資料庫檔案
});

module.exports = sequelize;
