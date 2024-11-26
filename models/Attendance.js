const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // 載入資料庫配置

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: '主鍵'
  },
  worker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '員工編號'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '日期'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['working', 'resting', 'dining']]
    },
    comment: '狀態'
  },
  timeStart: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '開始時刻（24小時制）'
  },
  timeEnd: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '結束時刻（24小時制）'
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '時長（小時）'
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '備註'
  }
}, {
  tableName: 'attendance', // 指定資料表名稱
  timestamps: true,
  hooks: {
    beforeCreate: (attendance) => {
      // 如果有值則計算，否則設為 null
      if (attendance.timeStart != null && attendance.timeEnd != null) {
        attendance.duration = attendance.timeEnd - attendance.timeStart;
      } else {
        attendance.duration = null; // 無法計算則設為 null
      }
    },
    beforeUpdate: (attendance) => {
      // 同步更新時也重新計算 duration
      if (attendance.timeStart != null && attendance.timeEnd != null) {
        attendance.duration = attendance.timeEnd - attendance.timeStart;
      } else {
        attendance.duration = null; // 無法計算則設為 null
      }
    },
  },
});

module.exports = Attendance;

