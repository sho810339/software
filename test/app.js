const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // 引入資料庫配置
const CTManagementPageRoutes = require('./routes/CTManagementPageRoutes'); // 引入路由檔案

// 建立 Express 應用
const app = express();

// 解析 JSON 格式的請求
app.use(bodyParser.json());

// 註冊路由
app.use('/api/ct-management', CTManagementPageRoutes);

// 資料庫同步
sequelize.sync()  // 設置 force: true 會強制重新建立資料表（會清空資料）
  .then(() => {
    console.log('資料庫同步成功');
    app.listen(3000, () => {
      console.log('伺服器啟動在 http://localhost:3000');
    });
  })
  .catch(error => {
    console.error('資料庫同步失敗:', error);
  });
