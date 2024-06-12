const multer = require('multer');
const upload = multer({ dest: '../uploads' }); 
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const moment = require('moment');
const app = express()
app.use('/static',express.static('static'));


 //기록get
 router.get('/record', function (req, res) {
    const userId = req.session.userId;
    const userNm = req.session.userNm;

    res.render('mypageRecord.ejs',{
         resultString: 'resultString',
         resultString2: 'resultString2',
         resultString3: 'resultString3',
         userId,
         userNm

        });

});

app.post("/upload", upload.single('image'), (req, res) => { 
   
    const file = req.file;

    const title = req.body.title;

    res.json({ file, title });
});

//기록 
router.post('/input', async (req, res) => {
    try {
       //시간
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const inputDttm = `${year}-${month}-${day}`;
        const updDttm = `${year}-${month}-${day}`;

        // "YYYYMMDD" 형식으로 변환
        const doDate = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\D/g, '');

        const userId = req.session.userId; 
        const foodNm = req.body.foodNm;
        const weight = req.body.Weight;
        const height = req.body.Tall;
        const drnkAmnt = req.body.drnkAmnt;
        const stepCnt = req.body.stepCnt;

        for (let i = 1; i <= 3; i++) {
            let mealCd1tKey = `kcal${i}`;
            let mealCd1 = req.body[mealCd1tKey];
            mealCd1 += ` 0${i}`;

            let selectedResultKey = `selectedResult${i}`;
            let selectedResult = req.body[selectedResultKey];
            selectedResult += ` 0${i}`;
          
            if (selectedResult.indexOf('undefined') === -1 && (selectedResult.endsWith('01') || selectedResult.endsWith('02') || selectedResult.endsWith('03'))) {
                
                const pattern = /\[([^\]]+)\]\s*([^:]+):([\d.]+)\s*(\d+)/;
                const match = selectedResult.match(pattern);
            
                const foodCd = match[1];
                const foodNm = match[2];
                const kcal = parseFloat(match[3]); 
                const mealCd = match[4];
              
                    db.saveApiMeal(userId,mealCd,foodCd,foodNm, kcal);
                   
            } else {
              
                // kcal1에 대한 처리
                if (mealCd1.indexOf('undefined') === -1 && mealCd1.endsWith('01') || mealCd1.endsWith('02') || mealCd1.endsWith('03')) {
                    let parts = mealCd1.split(' ');
                    let kcal = parts[0];
                    let mealCd = parts[1];
                   
                    // db.js의 함수를 호출하여 데이터베이스에 삽입
                    if (kcal.indexOf('undefined') === -1) {
                       
                        db.saveDrtMeal(userId, mealCd,foodNm, kcal );
                      
                    }
                }
            }
        }
        // 다른 입력값에 대한 처리
        if (height) {
            db.saveUserHeight(userId, height);
           
        }
        if (drnkAmnt) {
            db.insertTable('hethDrnk', { userId,doDate, drnkAmnt, inputDttm, updDttm });
           
        }
        if (weight) {
            db.insertTable('hethWegt', { userId, doDate,weight,inputDttm, updDttm });
            
        }
        if (stepCnt) {
            db.insertTable('hethExer', { userId,doDate, stepCnt, inputDttm, updDttm });
            
        }

        res.redirect('/mypage/record');
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


//체중 get
router.get('/weight', async function (req, res) {
    //시간
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const doDttm = `${year}-${month}-${day}`;
    
    const userId = req.session.userId; 
   
  
    try {
    //체중 차트
      const weightData = await db.selectWeightWeek(userId);
      const weightData2 = await db.selectWeightMonth(userId);
      const weightData3 = await db.selectWeightYear(userId);

      const weight = weightData.map(data => data.weight);
      const doDate = weightData.map(data => data.doDate);
      const weight2 = weightData2.map(data => data.weight);
      const doDate2 = weightData2.map(data => data.doDate);
      const weight3 = weightData3.map(data => data.weight);
      const doDate3 = weightData3.map(data => data.doMonth);
      
     //bmi
      const selectUserBmi = await db.selectUserBmi(userId);

      const bmiweight = selectUserBmi[0].weight;
      const bmiheight = selectUserBmi[0].height;
      const bmi = selectUserBmi[0].bmi;
      const bmiNm = selectUserBmi[0].bmiNm;
    
      if(bmiweight== 0|| bmiheight==0){//체중 또는 입력 없을 때 처리
        res.send(`<script type="text/javascript">alert("체중 또는 신장을 입력해주세요"); document.location.href="/mypage/record";</script>`);
      }
      else {
        res.render('mypageWeight', { doDttm , weight, doDate, weight2, doDate2, weight3, doDate3,bmiweight,bmiheight,bmi,bmiNm });
       
      }
    } catch (error) {
     
      console.error('에러 발생:', error);
      res.status(500).send('내부 서버 오류');
    }
  });
  

// 칼로리 get
router.get('/clalorie', async function (req, res) {
    const userId = req.session.userId; 
    // 시간
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const doDttm = `${year}-${month}-${day}`;

    // 하루 칼로리 열량
    const selectUserBmi = await db.selectUserBmi(userId);
    const gender = req.body.gender === 'male' ? '01' : '02';
    const selectUserDayNeedKcal = await db.selectUserDayNeedKcal(userId, gender);
    const bmiweight = selectUserBmi[0].weight;
    const bmiheight = selectUserBmi[0].height;
    const msg = selectUserBmi[0].msg;
    //칼로리 차트
    const weightData = await db.selectKcalWeek(userId);
      const weightData2 = await db.selectKcalMonth(userId);
      const weightData3 = await db.selectKcalYear(userId);

      const kcal = weightData.map(data => data.kcal);
      const doDate = weightData.map(data => data.doDate);
      const kcal2 = weightData2.map(data => data.kcal);
      const doDate2 = weightData2.map(data => data.doDate);
      const kcal3 = weightData3.map(data => data.Kcal);
      const doDate3 = weightData3.map(data => data.doMonth);

   

    if (msg === null) {
        const bmi = selectUserDayNeedKcal[0].bmi;
        const bmiNm = selectUserDayNeedKcal[0].bmiNm;
        const stddWeight = selectUserDayNeedKcal[0].stddWeight;
        const dayNeedKcal = selectUserDayNeedKcal[0].dayNeedKcal;

        res.render('mypageClalorie.ejs', { doDttm, bmiweight, bmiheight, stddWeight, bmi, dayNeedKcal, bmiNm, kcal,doDate, kcal2,doDate2, kcal3,doDate3});
    } else {
        res.send(`<script type="text/javascript">alert("체중 또는 신장을 입력해주세요"); document.location.href="/mypage/record";</script>`);
    }
});


// 칼로리 post
router.post('/clalorie', async function (req, res) {
    const userId = req.session.userId; 

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const doDttm = `${year}-${month}-${day}`;

    const gender = req.body.gender === 'male' ? '01' : '02';
    

    if (gender) {
        // 하루열량 계산
      
        const selectUserDayNeedKcal = await db.selectUserDayNeedKcal(userId, gender);
        const selectUserBmi = await db.selectUserBmi(userId);

        const bmi = selectUserDayNeedKcal[0].bmi;
        const bmiNm = selectUserDayNeedKcal[0].bmiNm;
        const stddWeight = selectUserDayNeedKcal[0].stddWeight;
        const dayNeedKcal = selectUserDayNeedKcal[0].dayNeedKcal;

        const bmiweight = selectUserBmi[0].weight;
        const bmiheight = selectUserBmi[0].height;
     
       res.json({ bmiheight, bmi, dayNeedKcal, stddWeight, bmiNm });
    } else {
       
        res.status(400).json({ error: 'Gender not provided' });
    }

    
});



//음수량 get
router.get('/water', async function(req, res){
    const userId = req.session.userId; 
    //시간
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const doDttm = `${year}-${month}-${day}`;
    //권량 물 섭취량
    const selectRecmDrinkAmntResult = await db.selectRecmDrinkAmnt(userId);
    const formula = selectRecmDrinkAmntResult[0].formula;
    const recmDrinkAmnt = selectRecmDrinkAmntResult[0].recmDrinkAmnt;

    //음수량 차트
    const selectDrinkWeek = await db.selectDrinkWeek(userId);
    const selectDrinkMonth = await db.selectDrinkMonth(userId);
    const selectDrinkYear = await db.selectDrinkYear(userId);

    const drnkAmnt = selectDrinkWeek.map(data => data.drnkAmnt);
    const doDate = selectDrinkWeek.map(data => data.doDate);
    const drnkAmnt2 = selectDrinkMonth.map(data => data.drnkAmnt);
    const doDate2 = selectDrinkMonth.map(data => data.doDate);
    const drnkAmnt3 = selectDrinkYear.map(data => data.drnkAmnt);
    const doDate3 = selectDrinkYear.map(data => data.doMonth);

    res.render('mypageWater.ejs', { doDttm,formula,recmDrinkAmnt,drnkAmnt,doDate,drnkAmnt2,doDate2,drnkAmnt3,doDate3 });

})

//걸음수 get
    router.get('/walk', async function(req, res){
    const userId = req.session.userId;
    
//시간
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const doDttm = `${year}-${month}-${day}`;
//오늘의 걸음수 
    const selectStepDay = await db.selectStepDay(userId);
//차트
    const selectStepWeek = await db.selectStepWeek(userId);
    const selectStepMonth = await db.selectStepMonth(userId);
    const selectStepYear = await db.selectStepYear(userId);
   
   if (selectStepDay && selectStepDay.length > 0) {
//오늘의걸음수
         const userNm = selectStepDay[0].userNm;
         const daystepCnt = selectStepDay[0].stepCnt;
         const stepConsKcal = selectStepDay[0].stepConsKcal;
//차트
        const stepCnt = selectStepWeek.map(data => data.stepCnt);
        const doDate = selectStepWeek.map(data => data.doDate);
        const stepCnt2 = selectStepMonth.map(data => data.stepCnt);
        const doDate2 = selectStepMonth.map(data => data.doDate);
        const stepCnt3 = selectStepYear.map(data => data.stepCnt);
        const doDate3 = selectStepYear.map(data => data.doMonth);

    res.render('mypageWalk.ejs',{ doDttm,stepCnt,doDate,stepCnt2,doDate2,stepCnt3,doDate3,userNm,daystepCnt,stepConsKcal});
        
   
  } else {
   
    res.send(`<script type="text/javascript">alert("오늘의 걸음수를 입력해주세요"); document.location.href="/mypage/record";</script>`);
  }
})


// api처리
router.post('/record', async (req, res) => {
   
    const userId = req.session.userId;
    const userNm = req.session.userNm;
    //api연동
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
         // 응답 추출
         const resultArray = response.data.I2790.row.slice(0, 100);

         // 각 결과를 출력
         let resultString = '';
         let resultString2 = '';  
         let resultString3 = ''; 
         resultArray.forEach((result, index) => {
        var calories = result.NUTR_CONT1;
        var foodname = result.DESC_KOR;
        var foodCd= result.FOOD_CD;
        
        resultString +=`[${foodCd}] ${foodname}:${calories}칼로리\n`;
        
        resultString2 +=`[${foodCd}] ${foodname}:${calories}칼로리\n`;
        
        resultString3 +=`[${foodCd}] ${foodname}:${calories}칼로리\n`;
           
    });

         res.render('mypageRecord.ejs', { resultString, resultString2, resultString3,userId,userNm });
       
    } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

module.exports = router;