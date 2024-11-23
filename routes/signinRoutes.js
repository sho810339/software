const express = require('express');
const { login, signin, signout } = require('../controllers/signinController');

const router = express.Router();

// 登入路由
router.post('/login', login);

// 簽到路由
router.post('/signin', signin);

// 簽退路由
router.post('/signout', signout);

module.exports = router;