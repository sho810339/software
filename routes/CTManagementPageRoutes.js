const express = require('express');
const router = express.Router();

// 引入控制器
const {
    getEmployees,
    getWorkHoursByDate,
    registerWorkHours,
    getNotificationCount,
    getNotifications,
    cancelNotification,
    checkWorkHours
} = require('../controllers/CTManagementPageController'); // 假設控制器檔案名為 CTManagementController.js

// api1：在開啟app時取得員工資料(不含員工當日工時)
router.get('/employees', getEmployees);

// api2：取得指定日期所有員工工時
router.get('/work-hours/:date', getWorkHoursByDate);

// api3：登記指定日期員工工時
router.post('/register-work-hours', registerWorkHours);

// api4：取得通知數量
router.get('/notification-count', getNotificationCount);

// api5：取得通知內容
router.get('/notifications', getNotifications);

// api6：取消指定的通知
router.delete('/cancel-notification/:index', cancelNotification);

// api7：確認某天某船員是否有登記工時
router.post('/check-work-hours', checkWorkHours);

module.exports = router;