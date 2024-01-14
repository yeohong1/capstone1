
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const moment = require('moment');//현재시간
const app = express()
app.use('/static',express.static('static'));

 //mypage/record
 router.get('/record', function (req, res) {
    res.render('mypageRecord.ejs',{
         resultString: 'resultString',
         resultString2: 'resultString2',
         resultString3: 'resultString3'
        
        });

});

//db 다른음식,체중신장,음수,걸음수 입력받음
router.post('/input', async (req, res) => {
    try {
       

        const date = new Date(); // 날짜 생성
       
        // YYYY-MM-DD 형식으로 변환
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const inputDttm = `${year}-${month}-${day}`;
        const updDttm = `${year}-${month}-${day}`;

        // "YYYYMMDD" 형식으로 변환
        const doDate = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\D/g, '');
        //console.log('Do Date:', doDate);

        const userId = 'test'; // 테스트용 userId
        const foodNm = req.body.foodNm;
        const weight = req.body.Weight;
        const height = req.body.Tall;
        const drnkAmnt = req.body.drnkAmnt;
        const stepCnt = req.body.stepCnt;

        for (let i = 1; i <= 3; i++) {
            let mealCd1tKey = `kcal${i}`;
            let mealCd1 = req.body[mealCd1tKey];
            mealCd1 += ` 0${i}`;

        
           //console.log(foodNm, mealCd1);

            let selectedResultKey = `selectedResult${i}`;
            let selectedResult = req.body[selectedResultKey];
            selectedResult += ` 0${i}`;
            console.log("Iteration", i);
            console.log("mealCd1:", mealCd1);
            console.log("selectedResult:", selectedResult);
            

            if (selectedResult.indexOf('undefined') === -1 && (selectedResult.endsWith('01') || selectedResult.endsWith('02') || selectedResult.endsWith('03'))) {
                // 선택된 값 분석
                const pattern = /\[([^\]]+)\]\s*([^:]+):([\d.]+)\s*(\d+)/;
                const match = selectedResult.match(pattern);

                const foodCd = match[1];
                const foodNm = match[2];
                const kcal = parseFloat(match[3]); // 소수점 포함된 값이어도 parseFloat로 숫자로 변환
                const mealCd = match[4];
                console.log(userId,mealCd,foodCd,foodNm, kcal);
                //console.log(selectedResult);
                // let parts = selectedResult.split(' ');
                // let foodCd = parts[0];
                // let foodInfo = parts[1].split(':');
                // let foodNm = foodInfo[0];
                // let kcal = foodInfo[1];
                // let mealCd = parts[2];

               

                //console.log(typeof kcal);
                console.log("Inside if block for selectedResult");
                // db.js의 함수를 호출하여 데이터베이스에 삽입
               // if (kcal) {
                    console.log("db입력1");
                    db.saveApiMeal(userId,mealCd,foodCd,foodNm, kcal);
                    console.log( userId,mealCd,foodCd,foodNm, kcal);
                    console.log("ok");
                    
               // }
            } else {
                console.log("Inside else block for selectedResult");
                console.log("mealCd1", mealCd1);

                
                // kcal1에 대한 처리
                if (mealCd1.indexOf('undefined') === -1 && mealCd1.endsWith('01') || mealCd1.endsWith('02') || mealCd1.endsWith('03')) {
                    console.log("3");
                    let parts = mealCd1.split(' ');
                    let kcal = parts[0];
                    let mealCd = parts[1];
                    console.log(typeof kcal);

                    console.log(kcal,mealCd);

                    // db.js의 함수를 호출하여 데이터베이스에 삽입
                    if (kcal.indexOf('undefined') === -1) {
                        console.log("db입력2");
                        db.saveDrtMeal(userId, mealCd,foodNm, kcal );
                        console.log(foodNm, kcal, userId, mealCd);
                      
                    }
                }
            }
        }
        // 다른 입력값에 대한 처리 (키에 따라 필요한 로직 추가)
        if (height) {
            db.insertTable('commUser', { userId, height, inputDttm, updDttm });
            console.log(userId, height, inputDttm, updDttm);
        }
        if (drnkAmnt) {
            db.insertTable('hethDrnk', { userId, drnkAmnt, doDate, inputDttm, updDttm });
            console.log(userId, drnkAmnt, doDate, inputDttm, updDttm);
        }
        if (weight) {
            db.insertTable('hethWegt', { userId, weight, doDate, inputDttm, updDttm });
            console.log(userId, weight, doDate, inputDttm, updDttm);
        }
        if (stepCnt) {
            db.insertTable('hethExer', { userId, stepCnt, doDate, inputDttm, updDttm });
            console.log(userId, stepCnt, doDate, inputDttm, updDttm);
        }

        res.redirect('/mypage/record');
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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    const day = String(date.getDate()).padStart(2, '0');
    
    const doDttm = `${year}-${month}-${day}`;

res.render('mypageWeight.ejs',{ doDttm});

});

router.get('/clalorie', function (req, res) {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    const day = String(date.getDate()).padStart(2, '0');
    
    const doDttm = `${year}-${month}-${day}`;

    res.render('mypageClalorie.ejs',{ doDttm});

});

router.get('/water', function(req, res){
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    const day = String(date.getDate()).padStart(2, '0');
    
    const doDttm = `${year}-${month}-${day}`;

    
    res.render('mypageWater.ejs',{ doDttm});
})


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
        const requestEndPoint = 1000;
        var calories;
        var foodname;
       
        // API 요청 URL 생성
        const apiUrl = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceName}/${requestFileType}/${requestStartPoint}/${requestEndPoint}/DESC_KOR=${encodeURIComponent(foodName)}`;

        // API 호출
        const response = await axios.get(apiUrl);

      
         // 응답에서 5개의 결과를 추출
         const resultArray = response.data.I2790.row.slice(0, 100);

         // 각 결과를 출력
         let resultString = '';
         let resultString2 = '';  
         let resultString3 = ''; 
         resultArray.forEach((result, index) => {
             var calories = result.NUTR_CONT1;
             var foodname = result.DESC_KOR;
             var foodCd= result.FOOD_CD;
           // 조건에 따라 각각의 resultString에 추가
           //if (resultString) {
            resultString +=`[${foodCd}] ${foodname}:${calories}칼로리\n`;
           
            resultString2 +=`[${foodCd}] ${foodname}:${calories}칼로리\n`;
         
            resultString3 +=`[${foodCd}] ${foodname}:${calories}칼로리\n`;
           // }
    });

         // 결과 저장
         res.render('mypageRecord.ejs', { resultString, resultString2, resultString3 });
       // console.log(resultString.foodCd);
    } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

module.exports = router;