const Login = require('../models/Login'); // 登入模型
const Attendance = require('../models/Attendance'); // 出勤記錄模型
const Worker = require('../models/Worker'); // 船員模型

// 船長登入
const captainLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const captain = await Login.findOne({ where: { username, password, role: 'captain' } });
    if (!captain) {
      return res.status(401).json({ error: '登入失敗，請檢查帳號或密碼' });
    }
    res.status(200).json({ message: '登入成功', captain });
  } catch (error) {
    res.status(500).json({ error: '伺服器錯誤，無法完成登入' });
  }
};

// 新增工作記錄
const addWorkLog = async (req, res) => {
  const { workerId, date, status, timeStart, timeEnd, comments } = req.body;
  try {
    // 確認時間合理性
    if (timeEnd <= timeStart) {
      return res.status(400).json({ error: '結束時間必須晚於開始時間' });
    }
    const duration = timeEnd - timeStart;

    // 確認船員是否存在
    const worker = await Worker.findByPk(workerId);
    if (!worker) {
      return res.status(404).json({ error: '找不到對應的船員' });
    }

     // 計算當日已登記的總工時
    const existingLogs = await Attendance.findAll({
      where: { Worker_id: workerId, date },
    });
    const totalHoursToday = existingLogs.reduce((sum, log) => sum + log.duration, 0) + duration;

    // 設定每日工時上限
    const maxHoursPerDay = 8;
    let alertMessage = null;

    if (totalHoursToday > maxHoursPerDay) {
      alertMessage = 注意：該船員當日總工時已超過 ${maxHoursPerDay} 小時（目前總工時：${totalHoursToday} 小時）。;
    }

    // 新增出勤記錄
    const workLog = await Attendance.create({
      Worker_id: workerId,
      date,
      status,
      timeStart,
      timeEnd,
      duration,
      comments,
    });

    res.status(201).json({ message: '工作記錄新增成功', workLog });
  } catch (error) {
    res.status(500).json({ error: '伺服器錯誤，無法新增工作記錄' });
  }
};

// 查看已登記的工作記錄
const viewWorkLogs = async (req, res) => {
  const { workerId } = req.params;
  try {
    // 查詢該船員的所有出勤記錄
    const workLogs = await Attendance.findAll({
      where: { Worker_id: workerId },
      order: [['date', 'ASC'], ['timeStart', 'ASC']],
    });

    if (workLogs.length === 0) {
      return res.status(404).json({ error: '未找到該船員的任何工作記錄' });
    }

    res.status(200).json({ workLogs });
  } catch (error) {
    res.status(500).json({ error: '伺服器錯誤，無法檢視工作記錄' });
  }
};

module.exports = {
  captainLogin,
  addWorkLog,
  viewWorkLogs,
};
