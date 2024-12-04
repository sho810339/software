const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret_key';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ error: '未提供授權 Token' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // 將解碼後的使用者資料放入 req.user
      next();
    } catch (error) {
      console.error('Token 驗證失敗:', error);
      return res.status(403).json({ error: '無效的 Token' });
    }
  };

// const authenticate = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // 獲取 Bearer 後的 Token

//   if (!token) {
//     return res.status(401).json({ error: '未提供授權 Token' });
//   }

//   try {
//     // 解碼 Token
//     const decoded = jwt.verify(token, SECRET_KEY);

//     // 僅驗證角色是否為 captain
//     if (decoded.role !== 'captain') {
//       return res.status(403).json({ error: '只有船長才能執行此操作' });
//     }

//     req.user = decoded; // 保存解碼後的用戶信息
//     next(); // 驗證通過，繼續執行後續邏輯
//   } catch (err) {
//     res.status(403).json({ error: '無效的 Token' });
//   }
// };

module.exports = authenticate;
