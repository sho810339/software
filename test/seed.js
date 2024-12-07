const { Worker, Attendance, Notification } = require('./models'); // 引入模型

async function seedData() {
    try {
        // 1. 插入測試員工資料
        const workers = await Worker.bulkCreate([
            {
                given_name: 'John', 
                family_name: 'Doe', 
                age: 30, 
                country: 'USA', 
                passport_number: 'A12345678', 
                job_title: 'engineer', 
                profilePhoto: 'path/to/photo1.jpg'
            },
            {
                given_name: 'Jane', 
                family_name: 'Smith', 
                age: 28, 
                country: 'Canada', 
                passport_number: 'B23456789', 
                job_title: 'cook', 
                profilePhoto: 'path/to/photo2.jpg'
            },
            {
                given_name: 'Alice', 
                family_name: 'Johnson', 
                age: 35, 
                country: 'UK', 
                passport_number: 'C34567890', 
                job_title: 'deckhand', 
                profilePhoto: 'path/to/photo3.jpg'
            },
            {
                given_name: 'Bob', 
                family_name: 'Brown', 
                age: 40, 
                country: 'Australia', 
                passport_number: 'D45678901', 
                job_title: 'fisherman', 
                profilePhoto: 'path/to/photo4.jpg'
            }
        ]);

        console.log('員工資料插入成功！');

        // 2. 插入測試出勤資料
        const attendanceData = workers.map(worker => ({
            worker_id: worker.worker_id,
            date: '2024-12-01',
            status: '010101010101010101010101010101010101010101010101' // 假設每個時段的狀態，這是 48 小時的工時狀態（0 = 休息，1 = 工作，2 = 吃飯）
        }));

        await Attendance.bulkCreate(attendanceData);
        console.log('出勤資料插入成功！');

        // 3. 插入測試通知資料
        await Notification.bulkCreate([
            { content: 'Worker John has worked overtime for 5 hours on 2024-12-01', status: 'Unread' },
            { content: 'Worker Jane reported a mistake in the work hours for 2024-12-01', status: 'Unread' },
            { content: 'Worker Alice has completed the assigned task for today', status: 'Unread' },
            { content: 'Worker Bob has updated the task status for 2024-12-01', status: 'Unread' }
        ]);
        console.log('通知資料插入成功！');

    } catch (error) {
        console.error('資料插入失敗:', error.message);
    }
}

// 執行資料插入
seedData();
