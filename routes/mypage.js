
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const moment = require('moment');//현재시간
const app = express()
app.use('/static',express.static('static'));

 //mypage/record
 router.get('/record', function (req, res) {
    res.render('mypageRecord.ejs',{ resultString: 'resultString' });

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
        console.log('Do Date:', doDate);

        
        //const userId =req.body.userId;
        const userId = 'jieun';//test
        const foodNm1 = req.body.foodNm;
       // const kcal1 = req.body.kcal;//없는메뉴

        const weight = req.body.Weight;
        const height = req.body.Tall;
    
        const drnkAmnt = req.body.drnkAmnt;
        const stepCnt = req.body.stepCnt;
        
        for (let i = 1; i <= 3; i++) {
            
            let mealCd1tKey = `kcal${i}`;
            let mealCd1 = req.body[mealCd1tKey];//kcal1,2,3 input 받아옴
            mealCd1 += ` 0${i}`;// input값 + 01
            console.log(mealCd1);

            let selectedResultKey = `selectedResult${i}`;
            let selectedResult = req.body[selectedResultKey];
            selectedResult += ` 0${i}`;
      
            if (selectedResult.endsWith('01')) {
              // 선택된 값 분석
              let parts = selectedResult.split(' ');
      
              // foodCd
              let foodCd = parts[0];
      
             
              let foodInfo = parts[1].split(':');
      
              // foodNm
              let foodNm = foodInfo[0];
      
              //  kcal
              let kcal = foodInfo[1];
      
              //  mealCd
              let mealCd = parts[2];
      
              console.log(foodCd);
              console.log(foodNm);
              console.log(kcal);
              console.log(mealCd);
       
            
            
                // db.js의 함수를 호출하여 데이터베이스에 삽입

                if (kcal) {
                    db.insertTable('hethMeal', {foodNm ,kcal,foodCd, userId,mealCd,inputDttm,updDttm, doDate});
                    console.log(foodNm ,kcal,foodCd, userId,mealCd,inputDttm,updDttm,doDate);
                }
            }
            else if (selectedResult.endsWith('02')) {
                // 선택된 값 분석
                let parts = selectedResult.split(' ');
        
                // 첫 번째 부분은 foodCd
                let foodCd = parts[0];
        
                // 두 번째 부분을 공백을 기준으로 다시 분리
                let foodInfo = parts[1].split(':');
        
                // 두 번째 부분의 첫 번째 부분은 foodNm
                let foodNm = foodInfo[0];
        
                // 두 번째 부분의 두 번째 부분은 kcal
                let kcal = foodInfo[1];
        
                // 세 번째 부분은 meal
                let mealCd = parts[2];
        
                console.log(foodCd);
                console.log(foodNm);
                console.log(kcal);
                console.log(mealCd);
         
                  // db.js의 함수를 호출하여 데이터베이스에 삽입
  
                  if (kcal) {
                    db.insertTable('hethMeal', {foodNm ,kcal,foodCd, userId,mealCd,inputDttm,updDttm, doDate});
                    console.log(foodNm ,kcal,foodCd, userId,mealCd,inputDttm,updDttm,doDate);
                }
            }

            else if (selectedResult.endsWith('03')) {
                // 선택된 값 분석
                let parts = selectedResult.split(' ');
        
                // 첫 번째 부분은 foodCd
                let foodCd = parts[0];
        
                // 두 번째 부분을 공백을 기준으로 다시 분리
                let foodInfo = parts[1].split(':');
        
                // 두 번째 부분의 첫 번째 부분은 foodNm
                let foodNm = foodInfo[0];
        
                // 두 번째 부분의 두 번째 부분은 kcal
                let kcal = foodInfo[1];
        
                // 세 번째 부분은 meal
                let mealCd = parts[2];
        
                console.log(foodCd);
                console.log(foodNm);
                console.log(kcal);
                console.log(mealCd);
         
                  // db.js의 함수를 호출하여 데이터베이스에 삽입
  
                  if (kcal) {
                    db.insertTable('hethMeal', {foodNm ,kcal,foodCd, userId,mealCd,inputDttm,updDttm, doDate});
                    console.log(foodNm ,kcal,foodCd, userId,mealCd,inputDttm,updDttm,doDate);
                }
            }
            //없는 메뉴
             if (mealCd1.endsWith('01')) { 
                let parts = mealCd1.split(' ');  
                let kcal1 = parts[0]; 
                let mealCd = parts[1];
                    console.log("ok");   

                if (kcal1) {
                    db.insertTable('hethMeal', { foodNm1 ,kcal1, userId,mealCd,inputDttm,updDttm, doDate });
                    console.log(foodNm1 ,kcal1, mealCd,userId,inputDttm,updDttm, doDate);
                }
            }
              else if (mealCd1.endsWith('02')) {
                let parts = mealCd1.split(' ');  
                let kcal1 = parts[0]; 
                let mealCd = parts[1];   
                console.log("ok");   

                if (kcal1) {
                    db.insertTable('hethMeal', { foodNm1 ,kcal1, userId,mealCd,inputDttm,updDttm, doDate });
                    console.log(foodNm1 ,kcal1, userId,mealCd,inputDttm,updDttm, doDate);
                }
             }
             else if (mealCd1.endsWith('03')) { 
                let parts = mealCd1.split(' ');  
                let kcal1 = parts[0]; 
                let mealCd = parts[1];  
                console.log("ok");   

                if (kcal1) {
                    db.insertTable('hethMeal', { foodNm1 ,kcal1, userId,mealCd,inputDttm,updDttm, doDate });
                    console.log(foodNm1 ,kcal1, userId,mealCd,inputDttm,updDttm, doDate);
                }
             }

                if (height) {
                    db.insertTable('commUser', {userId, height,inputDttm,updDttm });//수정하기
                    console.log(userId, height,inputDttm,updDttm);
                }
                if (drnkAmnt) {
                    db.insertTable('hethDrnk', {userId, drnkAmnt,doDate,inputDttm,updDttm });
                    console.log(userId, drnkAmnt,doDate,inputDttm,updDttm);
                }
                if (weight) {
                    db.insertTable('hethWegt', { userId, weight,doDate,inputDttm,updDttm});
                    console.log(userId, weight,doDate,inputDttm,updDttm);
                    }
                if (stepCnt) {
                    db.insertTable('hethExer', { userId, stepCnt,doDate,inputDttm,updDttm });
                    console.log(userId, stepCnt,doDate,inputDttm,updDttm);
                    
                     }   

                    //console.log("Data inserted successfully.");
        
        }
        
            res.redirect('/mypage/record');
    } 
        catch (error) {
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

const doDttm=date.toLocaleDateString('ko-kr');

res.render('mypageWeight.ejs',{ doDttm: 'doDttm' });
//res.render('mypageWeight.ejs');
console.log(date.toLocaleDateString('ko-kr'));
console.log('year: ' + year);
console.log('month: ' + month);
console.log('day: ' + day);
});

router.get('/clalorie', function (req, res) {
    res.render('mypageClalorie.ejs');

});

router.get('/water', function(req, res){
    res.render('mypageWater.ejs');
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
         resultArray.forEach((result, index) => {
             var calories = result.NUTR_CONT1;
             var foodname = result.DESC_KOR;
             var foodCd= result.FOOD_CD;
            resultString += `${foodCd} ${foodname}:${calories}칼로리\n`;
             //console.log(resultString);
             
        });

         // 결과 저장
         res.locals.resultString = { resultString };
        console.log(resultString);
        res.render('mypageRecord.ejs',{ resultString:resultString })
       // console.log(resultString.foodCd);
    } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

module.exports = router;