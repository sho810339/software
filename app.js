require('dotenv').config();  // 這行會讀取根目錄中的 .env 檔案
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize, initializeDatabase, seedInitialData } = require('./config/database'); // 資料庫連線設定

const CTManagementPageRoutes = require('./routes/CTManagementPageRoutes');
const loginPageRoutes = require('./routes/loginPageRoutes');
const workerEditRoutes = require('./routes/workerEditRoutes');
const workerPageRoutes = require('./routes/workerPageRoutes');

const app = express();

// 使用 CORS
app.use(cors());

// 中間件
app.use(express.json());

app.use((req, res, next) => {
  console.log(`收到請求: ${req.method} ${req.url}`);
  next();
});

// 路由設定
app.use('/api/CTManagementPage', CTManagementPageRoutes);
app.use('/api/loginPage', loginPageRoutes);
app.use('/api/workerEdit', workerEditRoutes);
app.use('/api/workerPage', workerPageRoutes);

// 啟動伺服器
const PORT = 3000;

// 初始化資料庫並啟動伺服器
(async () => {
  try {
    const sqlFilePath = path.join(__dirname, 'fishman_db_design.sql');
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL 檔案不存在: ${sqlFilePath}`);
    }
    // 初始化資料庫結構
    await initializeDatabase(sqlFilePath);
    console.log('資料庫初始化完成！');

    // 測試資料庫連線
    await sequelize.authenticate();
    console.log('資料庫連線成功');

    await seedInitialData();
    console.log('插入初始資料成功！');

    // 啟動伺服器
    app.listen(PORT,'0.0.0.0',  () => {
      console.log(`伺服器正在執行，監聽 port ${PORT}`);
    });

    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Server running on:', process.env.DB_HOST || 'localhost');

  } catch (error) {
    console.error('應用程式初始化失敗:', error);
    process.exit(1);
  }
})();
