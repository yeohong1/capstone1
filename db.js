const knexConfiguration = {
  client: 'mssql',
  connection: {
    user: 'test',
    password: 'test',
    server: '125.135.61.140',
    database: 'CAPD',
    port: 1433,
  }
}
const knex = require('knex')(knexConfiguration)

//  selectUserYn('hyjkim')
//회원 여부 조회
function selectUserYn(userId) {
  knex.raw(
    `exec selectUserYn '${userId}'`
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

//  selectBodyInfo('hyjkim', '02')
//표준체중/bmi/하루필요열량 조회
async function selectBodyInfo(userId, gender) {
  try {
    const resp = await knex.raw(`selectBodyInfo '${userId}', '${gender}'`);
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



// async function selectStepWeek(userId) {
//   try {
//     const resp = await knex.raw(`exec selectStepWeek '${userId}'`);
//     console.log(resp);
//   } catch (err) {
//     console.log(err);
//   }
// }
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


// async function selectStepMonth(userId) {
//   try {
//     const resp = await knex.raw(`exec selectStepMonth '${userId}'`);
//     console.log(resp);
//   } catch (err) {
//     console.log(err);
//   }
// }

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


// async function selectStepYear(userId) {
//   try {
//     const resp = await knex.raw(`exec selectStepYear '${userId}'`);
//     console.log(resp);
//   } catch (err) {
//     console.log(err);
//   }
// }

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

function Select(table) {
  knex.select().table(table)
    .then(resp => {
        console.log(resp)
        return resp
      }
    )
    .catch(err => {
      console.log(err)
    })
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
  selectTable: function (table) {
    return Select(table);
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
//bmi계산
  selectBodyInfo,
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
  selectDrinkDay
};