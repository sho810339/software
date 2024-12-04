const Login = require('../models/Login');

// api1(username, passport)：登入功能
const login = async (req, res) => {
    const { username, pattern } = req.body;

    if (!username || !pattern) {
        return res.status(400).json({ message: '請提供使用者名稱和密碼' });
    }
    
    try {
      // 查詢帳號
      const user = await Login.findOne({ where: { username } });
      
      if (!user) {
        return res.status(401).json({ status: 0, error: '登入失敗，帳號不存在' });
      }
      
      // 比對密碼
      if (pattern !== user.pattern) {
        user.login_attempts += 1;
        await user.save();
        return res.status(401).json({ status: 0, error: '登入失敗，密碼錯誤' });
      }

      user.last_login = new Date();  // 設置為當前時間
      user.login_attempts = 0;
      await user.save();  // 保存更新的 last_login

      res.json({ status: 1, message: '登入成功' });
    } catch (error) {
      console.log('使用者輸入的資料:', username, pattern);
      console.log('查詢的用戶:', user);
      console.error('登入錯誤:', error);
      res.status(500).json({ error: '伺服器錯誤' });
    }
};

module.exports = { login };
