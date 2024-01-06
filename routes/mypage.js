const express = require('express');
const router = express.Router();
const axios = require('axios');

//mypage
router.get('/mypage', function (req, res, next) {
    res.render('mypage.html');
});

// HTTP GET 요청 보내기
router.post('/getCalories', async (req, res) => {
    try {
        const foodName = req.body.foodName;

        // 인증키
        const apiKey = 'e171d9fac4cc4db0ae29';
        const serviceName = 'I2790';
        const requestFileType = 'json';
        const requestStartPoint = 0;
        const requestEndPoint = 1000;

        // API 요청 URL 생성
        const apiUrl = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceName}/${requestFileType}/${requestStartPoint}/${requestEndPoint}/DESC_KOR=${encodeURIComponent(foodName)}`;

        // API 호출
        const response = await axios.get(apiUrl);

      
        const calories = response.data.I2790.row[0].NUTR_CONT1;

       
        res.send(`name ${foodName} calories ${calories}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
