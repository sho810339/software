const Attendance = require('./models/Attendance'); // 出勤記錄模型
const Worker = require('./models/Worker'); // 船員模型
const Notification = require('./models/Notification'); // 載入通知模型
const Login = require('./models/Login');
const Report = require('./models/Report');
const sequelize = require('./config/database'); // 引入資料庫連線

async function seed() {
  try {
    // 插入 'crew_members' 資料表
    await Worker.bulkCreate([
      {
        name: 'John Doe',
        age: 30,
        country: 'USA',
        passport_number: 'A12345678',
        job_title: 'engineer',
        profilePhoto: '/path/photo1.jpg',
      },
      {
        name: 'Jane Smith',
        age: 25,
        country: 'Canada',
        passport_number: 'B98765432',
        job_title: 'chef',
        profilePhoto: '/path/photo2.jpg',
      }
    ]);
    console.log("Crew members data seeded successfully!");

    // 插入 'reports' 資料表
    await Report.bulkCreate([
      {
        check: 1,
        worker_id: 1,
        date: '2024-12-01',
        issue_description: '正常工作',
      },
      {
        check: 0,
        worker_id: 2,
        date: '2024-12-02',
        issue_description: '報告延遲',
      }
    ]);
    console.log("Reports data seeded successfully!");

    // 插入 'notifications' 資料表
    await Notification.bulkCreate([
      {
        content: '系統更新通知',
        type: 'System Notification',
        status: 'Unread',
      },
      {
        content: '您的報告需要修改',
        type: 'Warning',
        status: 'Unread',
      }
    ]);
    console.log("Notifications data seeded successfully!");

    // 插入 'logins' 資料表
    await Login.bulkCreate([
      {
        username: 'captain1',
        worker_id: null,
        pattern: '172839',
        role: 'captain',
        language: 'en-US',
        login_attempts: 0,
      },
      {
        username: 'worker1',
        worker_id: 1,
        pattern: '4159',
        role: 'worker',
        language: 'zh-TW',
        login_attempts: 0,
      }
    ]);
    console.log("Logins data seeded successfully!");

    // 插入 'attendance' 資料表
    await Attendance.bulkCreate([
      {
        worker_id: 1,
        date: '2024-12-01',
        status: '111111000000000000000000000000000000000000000000',
        duration: 8,
      },
      {
        worker_id: 2,
        date: '2024-12-02',
        status: '000000111111000000000000000000000000000000000000',
        duration: 4,
      }
    ]);
    console.log("Attendance data seeded successfully!");
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();