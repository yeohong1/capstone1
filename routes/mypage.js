const express = require('express');
const router = express.Router();
const axios = require('axios');

const app = express()
app.use('/static',express.static('static'));

//mypage
router.get('/mypage', function (req, res, next) {
    res.render('mypage.ejs', { caloriesResult: req.session.caloriesResult });
});

// HTTP 요청 보내기
router.post('/getCalories', async (req, res, next) => {
    try {
        const foodName = req.body.foodName;
console.log(foodName);
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
             //console.log(resultString);
        });

         // 세션에 결과 저장
         res.locals.caloriesResult = { foodName, resultString };
         console.log(res.locals.caloriesResult);
        
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

  // /mypage 라우트 핸들러
router.get('/mypage', (req, res) => {
 res.render('mypage.ejs', { caloriesResult: res.locals.caloriesResult });
console.log(caloriesResult);
});

module.exports = router;
