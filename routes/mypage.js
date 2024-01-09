const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

const app = express()
app.use('/static',express.static('static'));

 //mypage/record
 router.get('/record', function (req, res) {
    res.render('mypageRecord.ejs',{ resultString: 'resultString' });

});

//db 다른음식,체중신장,음수,걸음수 입력받음
router.post('/input', async (req, res) => {
    
    try {
        const doDttm = new Date();//년월일
        //const userID = req.body.userID;//null

        const foodNm = req.body.foodNm;
        const kcal = req.body.kcal;
        //const mealCd = mealCd;//null 식사구분
        //const seq = seq;//null 순번

        const weight = req.body.Weight;
        const height = req.body.Tall;
        
        const drnkAmnt = req.body.drnkAmnt;
        const stepCnt = req.body.stepCnt;


        console.log(doDttm);
        console.log(weight);
        console.log(height);
        console.log(drnkAmnt);
        console.log(stepCnt);
        console.log(foodNm);
        console.log(kcal);
        // db.js의 함수를 호출하여 데이터베이스에 삽입

        if (kcal) {
            db.insertTable('hethMeal', { foodNm, kcal,doDttm });
        }

        if (weight) {
            db.insertTable('commUser', { weight, height, doDttm });
        }
        if (drnkAmnt) {
            db.insertTable('hethDrnk', { drnkAmnt });
        }
        if (stepCnt) {
            db.insertTable('hethExer', { stepCnt });
        }

        console.log("Data inserted successfully.");
        
        // 나머지 처리 또는 응답
        res.status(200).send('Menu and kcal inserted successfully.');
        //res.render('mypageRecord.ejs');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    
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

// router.post('',function(req,res){
//    var body ='';
//     const weight = req.body.Weight;
//     const tall = req.body.Tall;
//     req.on('data',function(chunk){
//         body +=chunk;
//         console.log(body);
//     });
//     req.on('end', function(){
//         var data =querystring.parse(body);
//         var weight  = data.Weight;
//         var tall = data.Tall;

//         console.log(weight);
//         console.log(tall);
//     });

//     console.log(weight);
//         console.log(tall);
// });



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
