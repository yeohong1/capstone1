const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const moment = require('moment');//현재시간
const app = express()
app.use('/static',express.static('static'));

router.get('/', function (req, res) {
    res.render('main.ejs');

});
module.exports = router;