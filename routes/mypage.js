const express = require('express');
const router = express.Router();
const axios = require('axios');

const app = express()
app.use('/static',express.static('static'));

 //mypage/record
 router.get('/record', function (req, res) {
    res.render('mypageRecord.ejs');

});

//mypage/weight
router.get('/weight', function (req, res) {
 const date = new Date();

const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

res.render('mypageWeight.ejs');
console.log('date: ' + date.toLocaleDateString('ko-kr'));
console.log('year: ' + year);
console.log('month: ' + month);
console.log('day: ' + day);
});

router.post('/placeholder',function(req,res){
   var body ='';
    const weight = req.body.Weight;
    const tall = req.body.Tall;
    req.on('data',function(chunk){
        body +=chunk;
    });
    req.on('end', function(){
        var data =querystring.parse(body);
        var weight  = data.Weight;
        var tall = data.Tall;

        console.log(weight);
        console.log(tall);
    });

   
    res.send('Received data successfully.'); 
});

// HTTP 요청 보내기
router.post('/record', async (req, res) => {
   

    //api연동
    try {
        const foodName = req.body.foodName;
        console.log(foodName);
        // 인증키
        const apiKey = 'e171d9fac4cc4db0ae29';
        const serviceName = 'I2790';
        const requestFileType = 'json';
        const requestStartPoint = 0;
        const requestEndPoint = 5;
        var calories;
        var foodname;
       
        // API 요청 URL 생성
        const apiUrl = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceName}/${requestFileType}/${requestStartPoint}/${requestEndPoint}/DESC_KOR=${encodeURIComponent(foodName)}`;

        // API 호출
        const response = await axios.get(apiUrl);

      
         // 응답에서 5개의 결과를 추출
         const resultArray = response.data.I2790.row.slice(0, 5);

         // 각 결과를 출력
         let resultString = '';
         resultArray.forEach((result, index) => {
             var calories = result.NUTR_CONT1;
             var foodname = result.DESC_KOR;
            resultString += `${foodname}: ${calories}칼로리\n`;
             //console.log(resultString);
        });

         // 결과 저장
         res.locals.resultString = { foodName, resultString };
        console.log(resultString);
        res.render('mypageRecord.ejs',{ resultString: foodName, resultString })
        console.log(resultString);
    } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

module.exports = router;
