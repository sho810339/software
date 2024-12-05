const work_hours = require('./work_hours');
const crew_members = require('./crew_members'); // 船員模型
const notification = require('./notification'); // 載入通知模型
const user_login = require('./user_login');
const report = require('./report');
// 將模型集中導出

module.exports = { work_hours, crew_members, notification, user_login, report };
