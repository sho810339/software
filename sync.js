const sequelize = require('./config/database');
const Worker = require('./models/Worker');
const Login = require('./models/Login');
const Attendance = require('./models/Attendance');
const Notification = require('./models/Notification');
const Report = require('./models/Report');

// 同步資料表
sequelize.sync({ force: true }) // 設置為 true 會刪除並重新創建表，僅在需要重建時使用
  .then(() => console.log('資料表同步成功'))
  .catch(err => console.error('資料表同步失敗:', err));
