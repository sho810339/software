const express = require('express');
const bodyParser = require('body-parser');

const signinRoutes = require('./routes/signinRoutes');
const captainRoutes = require('./routes/captainRoutes');
const workerRoutes = require('./routes/workerRoutes');
const alertRoutes = require('./routes/alertRoutes');
const { sequelize } = require('./config/database'); // 資料庫連線

const app = express();

// 中間件
app.use(bodyParser.json());

// 路由設定
app.use('/api/signin', signinRoutes);
app.use('/api/captain', captainRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/alerts', alertRoutes);

// 測試資料庫連線
sequelize.authenticate()
  .then(() => console.log('資料庫連線成功'))
  .catch(err => console.error('資料庫連線失敗:', err));

// 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器正在執行，監聽 port ${PORT}`);
});

