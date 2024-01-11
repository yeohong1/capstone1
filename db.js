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

//  selectBodyInfo('hyjkim', '02')
//표준체중/bmi/하루필요열량 조회
function selectBodyInfo(userId, gender) {
  knex.raw(
    `selectBodyInfo '${userId}', '${gender}'`
    ).then((resp) => {
  console.log(resp);
  }
).catch((err) => {
    console.log(err);
  });
}

// selectBodyInfo('hyjkim', '02')
//표준체중/bmi/하루필요열량 조회
function selectBodyInfo(userId, gender) {
  knex.raw(
    `
    SELECT ISNULL(A.stddWeight, 0) AS stddWeight
         , ISNULL(CAST(A.bmi AS DECIMAL(10,6)),0) AS bmi
         , ISNULL(A.dayNeedKcal, 0) AS dayNeedKcal
         , CASE WHEN A.bmi >= 0 AND A.bmi < 18.5 THEN '저체중'
                WHEN A.bmi >= 18.5 AND A.bmi < 23 THEN '정상'
                WHEN A.bmi >= 23 AND A.bmi < 25 THEN '비만'
                WHEN A.bmi >= 25 AND A.bmi < 30 THEN '경도비만'
                WHEN A.bmi >= 30 AND A.bmi < 35 THEN '중정도비만'
                WHEN A.bmi >= 35 THEN '고도비만'
            END AS bmiNm 
      FROM (SELECT ROUND(POWER(ROUND(A.height/100, 3),2) * genderCalNum, 2) AS stddWeight
                 , ROUND(A.weight / ROUND(POWER(ROUND(A.height/100, 3),2), 3), 1) AS bmi
                 , ROUND(POWER(ROUND(A.height/100, 3),2) * genderCalNum, 0) * 30 AS dayNeedKcal
              FROM (SELECT A.height, B.weight
                         , '${gender}' AS gender
                         , CASE WHEN '${gender}' = '01' THEN 22
                                WHEN '${gender}' = '02' THEN 21
                            END AS genderCalNum
                      FROM commUser A
                      LEFT JOIN hethWegt B
                        ON A.userId = B.userId
                       AND LEFT(B.doDttm, 8) = CONVERT(VARCHAR, GETDATE(), 112) -- YYYYMMDD
                      WHERE A.userId = '${userId}'
                   ) A
           ) A
    `
    ).then((resp) => {
  console.log(resp);
  }
).catch((err) => {
    console.log(err);
  });
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
  }
}