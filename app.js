const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // 資料庫連線

const CTManagementPageRoutes = require('./routes/CTManagementPageRoutes');
const loginPageRoutes = require('./routes/loginPageRoutes');
const workerEditRoutes = require('./routes/workerEditRoutes');
const workerPageRoutes = require('./routes/workerPageRoutes');


const app = express();

// 中間件
app.use(bodyParser.json());

// 路由設定
app.use('/api/CTManagementPage', CTManagementPageRoutes);
app.use('/api/loginPage', loginPageRoutes);
app.use('/api/workerEdit', workerEditRoutes);
app.use('/api/workerPage', workerPageRoutes);

// 測試資料庫連線
sequelize.authenticate()
  .then(() => console.log('資料庫連線成功'))
  .catch(err => console.error('資料庫連線失敗:', err));

// 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器正在執行，監聽 port ${PORT}`);
});

