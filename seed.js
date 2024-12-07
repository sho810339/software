const { work_hours, crew_members, notification, user_login, report } = require('./models'); // 引入模型
const sequelize = require('./config/database'); // 資料庫連接配置

async function seed() {
  try {
    // 插入 'crew_members' 資料表
    await crew_members.bulkCreate([
      {
        worker_id: 0, // 船長的編號為 0
        name: 'Captain Jack',
        age: 40,
        country: 'UK',
        passport_number: 'C12345678',
        job_title: 'captain',
        profilePhoto: '/path/photo3.jpg',
      },
      {
        worker_id: 1, // 員工編號
        name: 'John Doe',
        age: 30,
        country: 'USA',
        passport_number: 'A12345678',
        job_title: 'engineer',
        profilePhoto: '/path/photo1.jpg',
      },
      {
        worker_id: 2,
        name: 'Jane Smith',
        age: 25,
        country: 'Canada',
        passport_number: 'B98765432',
        job_title: 'chef',
        profilePhoto: '/path/photo2.jpg',
      }
    ]);
    console.log("Crew members data seeded successfully!");

    // 插入 'user_login' 資料表
    await user_login.bulkCreate([
      {
        username: 'captain1',
        worker_id: 0, // 船長
        pattern: '172839',
        role: 'captain',
        login_timestamp: new Date(),
        last_login: '2024-12-01',
        language: 'en-US',
        login_attempts: 0,
      },
      {
        username: 'worker1',
        worker_id: 1, // 員工 1
        pattern: '4159',
        role: 'fisherman',
        login_timestamp: new Date(),
        last_login: '2024-12-01',
        language: 'zh-TW',
        login_attempts: 0,
      },
      {
        username: 'worker2',
        worker_id: 2, // 員工 2
        pattern: '5621',
        role: 'fisherman',
        login_timestamp: new Date(),
        last_login: '2024-12-01',
        language: 'en-US',
        login_attempts: 0,
      }
    ]);
    console.log("User login data seeded successfully!");

    // 插入 'work_hours' 資料表
    await work_hours.bulkCreate([
      {
        worker_id: 1,
        date: '2024-12-01',
        status: '000000001111111111000000000000000011111111110000', // 狀態轉換
        duration: 20, // 時長，單位為半小時
        profilePhoto: '/path/photo1.jpg',
        signaturePhoto: '/path/signature1.jpg',
        check: 1, // 狀態檢查
        comments: '正常工作',
      },
      {
        worker_id: 2,
        date: '2024-12-02',
        status: '000000001111111100000000000000000011111111110000', // 狀態轉換
        duration: 18,
        profilePhoto: '/path/photo2.jpg',
        signaturePhoto: '/path/signature2.jpg',
        check: 0,
        comments: '休息時間',
      }
    ]);
    console.log("Work hours data seeded successfully!");

    // 插入 'notification' 資料表
    await notification.bulkCreate([
      {
        content: '系統更新通知',
        type: 'System Notification',
        status: 'Unread',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: '您的報告需要修改',
        type: 'Warning',
        status: 'Unread',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
    console.log("Notifications data seeded successfully!");

    // 插入 'report' 資料表
    await report.bulkCreate([
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

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
