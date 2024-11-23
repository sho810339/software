const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql', // 或 'postgres', 'sqlite', 'mssql'，根據您的需求更改
});

const WorkLog = sequelize.define('WorkLog', {
    Worker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '員工編號'
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '日期'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '狀態 (working/resting/dinning)',
        validate: {
            isIn: [['working', 'resting', 'dinning']]
        }
    },
    timeStart: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: '開始時刻，單位: 小時 (24小時制)'
    },
    timeEnd: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: '結束時刻，單位: 小時 (24小時制)'
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: '該筆登記時長，單位: 小時'
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '備註 (例如 sick 或額外狀態)'
    },
}, {
    comment: '船長登記員工工作時數'
});


module.exports = WorkLog;
