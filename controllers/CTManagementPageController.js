const Attendance = require('../models/Attendance'); // 出勤記錄模型
const Worker = require('../models/Worker'); // 船員模型
const Notification = require('../models/Notification'); // 載入通知模型

// api1()：在開啟app時取得員工資料(不含員工當日工時)	
const getEmployees = async (req, res) => {
    try {
        const employees = await Worker.findAll(); // 查詢所有員工資料，包含所有欄位
        res.json(employees); // 回傳所有員工資料
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
};

/*
const getEmployees = async (req, res) => {
    try {
        const employees = await Worker.findAll({
            attributes: [
                'worker_id',
                [sequelize.fn('CONCAT', sequelize.col('given_name'), ' ', sequelize.col('family_name')), 'worker_name'], // 合併名字
                ['job_title', 'working_type'], // 工種
                ['profilePhoto', 'worker_pic'] // 大頭貼
            ]
        });  // 查詢所有員工資料，排除工時
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
};
*/


// api2(string date)：取得指定日期所有員工工時
const getWorkHoursByDate = async (req, res) => {
    const { date } = req.params;  // 假設日期透過參數傳遞

    try {
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
        if (!isValidDate) {
            return res.status(400).json({ message: '無效的日期格式，必須為 YYYY-MM-DD' });
        }
        // 查詢指定日期的出勤記錄
        const attendanceRecords = await Attendance.findAll({
            where: { date },
            attributes: ['worker_id', 'status']
        });

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: '找不到指定日期的記錄' });
        }

        // 格式化結果，將 status 字串轉換為陣列
        const result = attendanceRecords.map(record => {
            return {
                worker_id: record.worker_id,
                working_hour: record.status.split('').map(Number) // 將字串轉換為數字陣列
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });

    }
};

// api3(int[] workerIDs, int[] updateWorkHours, string date)：登記指定日期員工工時
const registerWorkHours = async (req, res) => {
    const { workerIDs, updateWorkHours, date } = req.body;  // 假設這些資料是透過 body 傳遞

    try {
        // 驗證輸入
        if (!Array.isArray(workerIDs) || !Array.isArray(updateWorkHours)) {
            return res.status(400).json({ status: 0, message: '無效的輸入，workerIDs 和 updateWorkHours 必須為陣列' });
        }
        if (workerIDs.length === 0 || updateWorkHours.length !== 48) {
            return res.status(400).json({ status: 0, message: 'workerIDs 不可為空，updateWorkHours 必須為大小 48 的陣列' });
        }
        // 驗證 updateWorkHours 中的值是否有效
        if (!updateWorkHours.every(hour => [0, 1, 2].includes(hour))) {
            return res.status(400).json({ status: 0, message: 'updateWorkHours 必須包含 0、1 或 2' });
        }
        // 驗證每個 workerId 是否存在
        for (const workerId of workerIDs) {
            const worker = await Worker.findByPk(workerId);
            if (!worker) {
                return res.status(400).json({ message: `無效的 worker_id: ${workerId}` });
            }
        }

        // 將 updateWorkHours 轉換為字串（對應 Attendance.status 欄位格式）
        const statusString = updateWorkHours.join('');

        // 遍歷每個員工，更新其指定日期的工時
        for (const workerId of workerIDs) {
            const workingCounts = statusString.split('').filter(hour => hour === '1').length;
            // 查詢 worker_id 對應的 profilePhoto
            const worker = await Worker.findOne({
                where: { worker_id: workerId },
                attributes: ['profilePhoto'] // 只選擇需要的欄位
            });

            const profilePhoto = worker ? worker.profilePhoto : null;  // 如果找到了員工，獲取照片，否則為 null
            
            await Attendance.upsert({
                worker_id: workerId,
                date,
                status: statusString,
                duration: workingCounts,
                profilePhoto:profilePhoto
            });
            

            // 如果超過 14 小時，創建超時通知
            if (workingCounts > 28) {
                const overtimeHours = (workingCounts / 2).toFixed(1); // 轉換為小時並保留 1 位小數
                const notificationContent = `Worker ${workerId} has worked overtime for ${overtimeHours} hours on ${date}`;
                await Notification.create({
                    content: notificationContent,  // 通知內容
                    type: 'Warning',  // 設定通知類型為 'Warning'
                    status: 'Unread',  // 設定為未讀
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }
        res.json({ status: 1, message: '工時登記成功' }); // 回傳成功狀態
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
};


// api4()：取得通知數
const getNotificationCount = async (req, res) => {
    try {
        // 計算資料庫中所有通知數量
        const totalCount = await Notification.count();  // 不加任何條件，查詢所有通知
        
        if (totalCount === 0) {
            return res.status(404).json({ message: '目前沒有通知', status: 0 });
        }

        res.json({ notifications: totalCount }); // 回傳所有通知數量
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
};

// api5()：取得通知內容
const getNotifications = async (req, res) => {
    try {
        // 查詢所有通知，按生成時間排序
        const notifications = await Notification.findAll({
            attributes: ['notification_id', 'content'], // 僅選擇通知的 ID 和內容
            order: [['createdAt', 'ASC']] // 按生成時間升序排序
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: '沒有通知記錄' });
        }

        // 為每個通知生成 index
        const notificationsWithIndex = notifications.map((notification, idx) => ({
            index: idx + 1, // 生成從 1 開始的索引
            notification_id: notification.notification_id,
            content: notification.content
        }));
        res.json(notificationsWithIndex); // 回傳包含 index 的通知
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
};

// api6(int index)：取消指定的通知
const cancelNotification = async (req, res) => {
    const { index } = req.params;  // 假設通知索引是透過參數傳遞

    try {
        // 取得所有通知，按順序生成 index
        const notifications = await Notification.findAll({
            attributes: ['notification_id'], // 只需要取得通知的 ID
            order: [['createdAt', 'ASC']] // 確保按時間順序排列
        });

        // 確保 index 有效
        if (index < 1 || index > notifications.length) {
            return res.status(400).json({ status: 0, message: '無效的通知編號' });
        }

        // 找到對應的 notification_id
        const targetNotificationId = notifications[index - 1].notification_id;

        const deleteResult = await Notification.destroy({ where: { notification_id: targetNotificationId } });
        if (deleteResult === 0) {
            return res.status(404).json({ status: 0, message: '通知未找到或已刪除' });
        }

        res.json({ status: 1, message: '通知已成功取消' });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
};


const createReportNotification = async (worker_id, issue_description) => {
    try {
        // 創建通知內容
        const notificationContent = `Worker ${worker_id} reported: ${issue_description}`;

        // 創建通知
        const notification = await Notification.create({
            content: notificationContent,  // 通知內容
            type: 'Reminder',  // 設定通知類型為 'Reminder'
            status: 'Unread',  // 設定為未讀
        });

        console.log('通知創建成功:', notification);
    } catch (error) {
        console.error('通知創建失敗:', error.message);
        throw error;  // 拋出具體錯誤
    }
};

module.exports = {
    getEmployees,
    getWorkHoursByDate,
    registerWorkHours,
    getNotificationCount,
    getNotifications,
    cancelNotification,
    createReportNotification
};
