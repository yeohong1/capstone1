const multer = require('multer');
const upload = multer({ dest: '../uploads' }); 
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const moment = require('moment');//현재시간
const app = express()
app.use('/static',express.static('static'));


 //기록get
 router.get('/record', function (req, res) {
    res.render('mypageRecord.ejs',{
         resultString: 'resultString',
         resultString2: 'resultString2',
         resultString3: 'resultString3'
        
        });

});


app.post("/upload", upload.single('image'), (req, res) => { 
    //const inputNm = "image"
    // 'image'는 input 요소의 name 속성 값입니다. 동일하게 설정해야 합니다.

    // 업로드된 파일 정보는 req.file에 저장됩니다.
    const file = req.file;

    // 텍스트 필드 정보는 req.body에 저장됩니다.
    const title = req.body.title;

    // 파일 정보와 텍스트 필드 정보를 활용하여 원하는 작업을 수행합니다.

    // 응답
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

        const userId = 'hyjkim'; // 테스트용 userId
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
            console.log("Iteration", i);
            console.log("mealCd1:", mealCd1);
            console.log("selectedResult:", selectedResult);           

            if (selectedResult.indexOf('undefined') === -1 && (selectedResult.endsWith('01') || selectedResult.endsWith('02') || selectedResult.endsWith('03'))) {
                
                const pattern = /\[([^\]]+)\]\s*([^:]+):([\d.]+)\s*(\d+)/;
                const match = selectedResult.match(pattern);

                const foodCd = match[1];
                const foodNm = match[2];
                const kcal = parseFloat(match[3]); // 소수점 포함된 값이어도 parseFloat로 숫자로 변환 수정하기
                const mealCd = match[4];
                console.log(userId,mealCd,foodCd,foodNm, kcal);
              
                    console.log("db입력1");
                    db.saveApiMeal(userId,mealCd,foodCd,foodNm, kcal);
                    console.log( userId,mealCd,foodCd,foodNm, kcal);
                    console.log("ok");
                    
             
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
        // 다른 입력값에 대한 처리
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
    
    const userId = 'hyjkim'; // 테스트
  
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
     // const msg = selectUserBmi[0].msg;
      console.log(bmiweight);
      if(bmiweight== 0|| bmiheight==0){//체중 또는 입력 없을 때 처리
        res.send(`<script type="text/javascript">alert("체중 또는 신장을 입력해주세요"); document.location.href="/mypage/record";</script>`);
      }
      else {
        res.render('mypageWeight', { doDttm , weight, doDate, weight2, doDate2, weight3, doDate3,bmiweight,bmiheight,bmi,bmiNm });
       
      
    //   } else {
    //     // 데이터가 없으면 적절한 응답을 보냅니다.
    //     console.error('데이터가 없음');
    //     res.status(404).send('데이터가 없습니다.');
      }
    } catch (error) {
      // 에러 처리
      console.error('에러 발생:', error);
      res.status(500).send('내부 서버 오류');
    }
  });
  

// 칼로리 get
// GET 요청('/mypage/clalorie')
router.get('/clalorie', async function (req, res) {
    const userId = 'hyjkim'; // test
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

    if (msg === null) {
        console.log("1");
        // 여기서 변수들을 정의하여 클라이언트에게 응답합니다.
        // const stddWeight = 25; // 적절한 값으로 대체
        // const bmi = 0; // 적절한 값으로 대체
        // const dayNeedKcal = 0; // 적절한 값으로 대체
        // const bmiNm = ""; // 적절한 값으로 대체

        const bmi = selectUserDayNeedKcal[0].bmi;
        const bmiNm = selectUserDayNeedKcal[0].bmiNm;
        const stddWeight = selectUserDayNeedKcal[0].stddWeight;
        const dayNeedKcal = selectUserDayNeedKcal[0].dayNeedKcal;

        res.render('mypageClalorie.ejs', { doDttm, bmiweight, bmiheight, stddWeight, bmi, dayNeedKcal, bmiNm });
    } else {
        res.send(`<script type="text/javascript">alert("체중 또는 신장을 입력해주세요"); document.location.href="/mypage/record";</script>`);
    }
});


// 칼로리 post
router.post('/clalorie', async function (req, res) {
    const userId = 'hyjkim'; // test

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    const day = String(date.getDate()).padStart(2, '0');
    const doDttm = `${year}-${month}-${day}`;

    const gender = req.body.gender === 'male' ? '01' : '02';
    

    if (gender) {
        // 하루열량 계산
        console.log(gender);
        const selectUserDayNeedKcal = await db.selectUserDayNeedKcal(userId, gender);
        const selectUserBmi = await db.selectUserBmi(userId);

        const bmi = selectUserDayNeedKcal[0].bmi;
        const bmiNm = selectUserDayNeedKcal[0].bmiNm;
        const stddWeight = selectUserDayNeedKcal[0].stddWeight;
        const dayNeedKcal = selectUserDayNeedKcal[0].dayNeedKcal;

        const bmiweight = selectUserBmi[0].weight;
    const bmiheight = selectUserBmi[0].height;
       console.log("myapge.js");
       // res.render('mypageClalorie.ejs',{ stddWeight,bmiweight, bmiheight,bmi, dayNeedKcal, bmiNm });
       res.json(bmiheight,bmi, dayNeedKcal,stddWeight, bmiNm);
    } else {
        // Handle error case if gender is not provided
        res.status(400).json({ error: 'Gender not provided' });
    }

    
});



//음수량 get
router.get('/water', async function(req, res){
    const userId = 'hyjkim'; // test
    //시간
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
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
    const userId = 'hyjkim'; // test
//시간
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
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
        
    // 다른 속성에 액세스 및 처리
    
  } else {
   
    res.send(`<script type="text/javascript">alert("오늘의 걸음수를 입력해주세요"); document.location.href="/mypage/record";</script>`);
  }
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