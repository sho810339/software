const Login = require('../models/Login');
const Attendance = require('../models/Attendance');

// 登入功能
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Login.findOne({ where: { username, password } });
    if (!user) return res.status(401).json({ error: '登入失敗' });
    res.json({ message: '登入成功', user });
  } catch (error) {
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// 簽到功能
const signin = async (req, res) => {
  const { worker_id, date, timeStart } = req.body;
  try {
    const record = await Attendance.create({ worker_id, date, timeStart, status: 'working' });
    res.json({ message: '簽到成功', record });
  } catch (error) {
    res.status(500).json({ error: '無法簽到' });
  }
};

// 簽退功能
const signout = async (req, res) => {
  const { worker_id, date, timeEnd } = req.body;
  try {
    // 更新資料
    const [affectedRows] = await Attendance.update(
      { timeEnd, status: 'resting' },
      { where: { worker_id, date, status: 'working' } }
    );

    // 如果有受影響的行，查詢最新資料
    if (affectedRows === 0) return res.status(404).json({ error: '無法找到記錄或已簽退' });

    const updatedRecord = await Attendance.findOne({
      where: { worker_id, date, status: 'resting', timeEnd }
    });

    res.json({ message: '簽退成功', record: updatedRecord });
  } catch (error) {
    res.status(500).json({ error: '無法簽退' });
  }
};

module.exports = { login, signin, signout };
