const express = require('express');
const router = express.Router();

const { login } = require('../controllers/loginPageController');


// api1：登入路由
router.post('/login', login);

module.exports = router;