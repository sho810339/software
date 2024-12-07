const sequelize = require('../config/database');  // 引入 Sequelize 實例
const Worker = require('./Worker'); // 引入模型
const Attendance = require('./Attendance'); 
const Notification = require('./Notification');

// 綁定 Sequelize 實例到模型
const db = {
    Worker,
    Attendance,
    Notification,
    sequelize,
};

module.exports = db;
