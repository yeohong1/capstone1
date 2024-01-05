
const express = require('express');
const router = express.Router();

//index
router.get('/mypage', function (req, res, next) {
    res.render('index.html');
});

module.exports = router;
