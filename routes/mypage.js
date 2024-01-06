const express = require('express');
const router = express.Router();
const axios = require('axios');

//mypage
router.get('/mypage', function (req, res, next) {
    res.render('mypage.html');
});

// HTTP 요청 보내기
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

      
         // 응답에서 5개의 결과를 추출
         const resultArray = response.data.I2790.row.slice(0, 5);

         // 각 결과를 출력
         let resultString = '';
         resultArray.forEach((result, index) => {
             const calories = result.NUTR_CONT1;
             const foodname = result.DESC_KOR;
             resultString += `${foodname}: ${calories}칼로리\n`;
        });
 
        res.send(resultString); // 모든 결과를 클라이언트에 전송
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
