const work_hours = require('./work_hours');
const crew_members = require('./crew_members'); // 船員模型
const notification = require('./notification'); // 載入通知模型
const user_login = require('./user_login');
const report = require('./report');
// 將模型集中導出

crew_members.hasOne(user_login, { foreignKey: 'worker_id', sourceKey: 'worker_id' });
user_login.belongsTo(crew_members, { foreignKey: 'worker_id', targetKey: 'worker_id' });

module.exports = { work_hours, crew_members, notification, user_login, report };
