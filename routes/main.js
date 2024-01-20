const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const moment = require('moment');
const app = express()
app.use('/static',express.static('static'));

router.get('/', function (req, res) {
    const userNm =req.session.userNm
   
    res.render('main.ejs',{userNm});
   
});
  
module.exports = router;