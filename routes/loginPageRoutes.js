const express = require('express');
const router = express.Router();

const { captainLogin, workerLogin } = require('../controllers/loginPageController');


// api1：登入船長路由
router.post('/captainLogin', captainLogin);

// api2：登入漁工路由
router.post('/workerLogin', workerLogin);

module.exports = router;