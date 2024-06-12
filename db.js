const knexConfiguration = {
  client: 'mssql',
  connection: {
    user: 'test',
    password: '1234',
    server: '125.135.61.140',
    database: 'CAPD',
    port: 1433,
  }
}
const knex = require('knex')(knexConfiguration)


// saveUserHeight('hyjkim', 160.7)
//사용자 신장 저장
function saveUserHeight(userId, height) {
  knex.raw(
    `exec saveUserHeight '${userId}', ${height}`
    ).then((resp) => {
  console.log(resp);
  }
).catch((err) => {
    console.log(err);
  });
}

// saveApiMeal('hyjkim', '02', 'D000288', '곰보빵', '277.34')
//api 제출(저장) 버튼
function saveApiMeal(userId, mealCd, foodCd, foodNm, kcal) {
  knex.raw(
    `exec saveApiMeal '${userId}', '${mealCd}', '${foodCd}', '${foodNm}', '${kcal}'`
    ).then((resp) => {
  console.log(resp);
  }
).catch((err) => {
    console.log(err);
  });
}

// saveDrtMeal('hyjkim', '03', 'hyjkim 사용자입력 음식명3', '700')
//사용자 직접입력 inputbox 제출(저장) 버튼
function saveDrtMeal(userId, mealCd, foodNm, kcal) {
  knex.raw(
    `exec saveDrtMeal '${userId}', '${mealCd}', '${foodNm}', '${kcal}'`
    ).then((resp) => {
  console.log(resp);
  }
).catch((err) => {
    console.log(err);
  });
}

// selectUserBmi('hyjkim')
//사용자의 체중/키/bmi 조회
async function selectUserBmi(userId) {
  try {
    const resp = await knex.raw(`exec selectUserBmi '${userId}'`);
    console.log(resp);

    // If there is a return value, extract data from resp
    if (resp) {
      const bmiData = resp;
      return bmiData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // Throw the error to the calling code
  }
}


// selectUserDayNeedKcal('hyjkim', '02')
//사용자의 체중/키/bmi/표준체중/하루필요열량 조회
async function selectUserDayNeedKcal(userId, gender) {
  try {
    const resp = await knex.raw(`exec selectUserDayNeedKcal '${userId}', '${gender}'`);
    console.log(resp);

    // If there is a return value, you can extract data from resp
    if (resp) {
      const kcalData = resp;
      return kcalData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // Throw the error to the calling code
  }
}

// selectWeightWeek('hyjkim')
//지난 일주일 간의 체중 조회
async function selectWeightWeek(userId) {
  try {
    const resp = await knex.raw(`exec selectWeightWeek '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp ) {
      const weightData = resp;
      return weightData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

// selectWeightMonth('hyjkim')
//지난 한달 간의 체중 조회
async function selectWeightMonth(userId) {
  try {
    const resp = await knex.raw(`exec selectWeightMonth '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const weightData = resp;
      return weightData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

// selectWeightYear('hyjkim')
//지난 1년 간의 월별평균 체중 조회
async function selectWeightYear(userId) {
  try {
    const resp = await knex.raw(`exec selectWeightYear '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const weightData = resp;
      return weightData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

//  selectKcalWeek('hyjkim')
//지난 일주일 간의 칼로리 조회
async function selectKcalWeek(userId) {
  try {
    const resp = await knex.raw(`selectKcalWeek '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const bodyInfo = resp;
      return bodyInfo;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

//  selectKcalMonth('hyjkim')
//지난 한 달 간의 칼로리 조회
async function selectKcalMonth(userId) {
  try {
    const resp = await knex.raw(`selectKcalMonth '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const bodyInfo = resp;
      return bodyInfo;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

// selectKcalYear('hyjkim')
//지난 일년 간의 칼로리 조회
async function selectKcalYear(userId) {
  try {
    const resp = await knex.raw(`selectKcalYear '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const bodyInfo = resp;
      return bodyInfo;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

//일주일 음수량
async function selectDrinkWeek(userId) {
  try {
    const resp = await knex.raw(`exec selectDrinkWeek '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const drinkData = resp;
      return drinkData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}
//한달 음수량
async function selectDrinkMonth(userId) {
  try {
    const resp = await knex.raw(`exec selectDrinkMonth '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const drinkData = resp;
      return drinkData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}
//일년음수량
async function selectDrinkYear(userId) {
  try {
    const resp = await knex.raw(`exec selectDrinkYear '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const drinkData = resp;
      return drinkData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}


// selectRecmDrinkAmnt('hyjkim')
// 오늘의 권장 음수량 조회
async function selectRecmDrinkAmnt(userId) {
  try {
    const resp = await knex.raw(`exec selectRecmDrinkAmnt '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const drinkData = resp;
      return drinkData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}


// 지난 일주일 간의 걸음수 조회
async function selectStepWeek(userId) {
  try {
    const resp = await knex.raw(`exec selectStepWeek '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const stepdata = resp;
      return stepdata;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}



// 지난 한달 간의 걸음수 조회
async function selectStepMonth(userId) {
  try {
    const resp = await knex.raw(`exec selectStepMonth '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const stepdata = resp;
      return stepdata;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

// 지난 1년 간의 월별평균 걸음수 조회
async function selectStepYear(userId) {
  try {
    const resp = await knex.raw(`exec selectStepYear '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const stepdata = resp;
      return stepdata;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}

// 오늘의 걸음수(, 사용자명, 걸음당소모칼로리) 조회
async function selectStepDay(userId) {
  try {
    const resp = await knex.raw(`exec selectStepDay '${userId}'`);
    console.log(resp);

    // 반환값이 있을 경우 resp에서 데이터 추출
    if (resp) {
      const stepData = resp;
      return stepData;
    } else {
      console.error('데이터가 없음');
      return null;
    }
  } catch (err) {
    console.error('데이터베이스 쿼리 오류:', err);
    throw err; // 에러를 호출한 곳으로 던집니다.
  }
}


// 오늘의 음수량 조회
async function selectDrinkDay(userId) {
  try {
    const resp = await knex.raw(`exec selectDrinkDay '${userId}'`);
    console.log(resp);
  } catch (err) {
    console.log(err);
  }
}

function Insert(table,data) {//data는 {column:value} 형식
//테이블을 가지고 있는 상태에서 받아온 data가 구조에 맞는지 확인 후 실행할것.
  knex(table)
    .insert(data)
    .then(resp => {
      console.log(resp)
    })
    .catch(err => {
      console.log(err)
    })
}

function Update(table,target, data) {
  let targetKey= Object.keys(target)[0]
  let dataKey = Object.keys(data)[0]

  knex(table)
    .where(target)
    .update(data,[targetKey,dataKey],{includeTriggerModifications:true})
    .then(resp=>{
      console.log(resp)
    })
    .catch(err =>{
      console.log(err)
    })
}

function Delete(table, targetColumn, targetData) {
  knex(table).where(targetColumn, targetData).del()
    .then(resp => {
      console.log(resp)
    })
    .catch(err => {
      console.log(err)
    })
}

async function selectTable(table, userId) {
  try {
    const results = await knex(table).select().where({ userId });

    if (results && results.length > 0) {
      // 중복되는 userId가 있다면 에러 발생
      throw new Error('Duplicate userId found.');
    } else {
      // 중복되는 userId가 없으면 결과 반환
      return results;
    }
  } catch (error) {
    // 에러 발생 시 reject
    throw error;
  }
}

function GetTableColumns(table) {
  return new knex('INFORMATION_SCHEMA.COLUMNS').where({
    'TABLE_NAME': table,
  }).select('COLUMN_NAME')
}

async function login(table, data) {
  return new Promise((resolve, reject) => {
    knex
      .select()
      .from(table)
      .where(data)
      .then(results => {
        if (results && results.length > 0) {
          
          resolve(results);
        } else {
          
          reject(new Error('No matching record found.'));
        }
      })
      .catch(error => reject(error));
  });
}

module.exports = {
  getTableColumns: function (table) {
    return GetTableColumns(table);
  },
  login: function (table, data) {
    return login(table, data);
  },
  insertTable: function (table, data) {
    Insert(table, data);
  },
  updateTable: function (table, target, data) {
    Update(table, target, data);
  },
  deleteTable: function (table, targetColumn, targetData) {
    Delete(table, targetColumn, targetData);
  },
  //식단 입력
  saveApiMeal,
  saveDrtMeal,
  //키 저장
  saveUserHeight,
//bmi계산
  selectUserBmi,//bmi
  selectUserDayNeedKcal,//하루열량
  //칼로리
  selectKcalWeek,
  selectKcalMonth,
  selectKcalYear,
//몸무게
  selectWeightWeek, 
  selectWeightMonth, 
  selectWeightYear,
//음수량
  selectDrinkWeek, 
  selectDrinkMonth, 
  selectDrinkYear,
  selectRecmDrinkAmnt,
  //걸음수 
  selectStepWeek, 
  selectStepMonth, 
  selectStepYear,
//오늘의 걸음수
  selectStepDay,
  //오늘의 음수량
  selectDrinkDay,
  selectTable
};