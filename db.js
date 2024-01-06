const knexConfiguration = {
  client: 'mssql',
  connection: {
    user: 'test',
    password: 'test',
    server: '172.30.1.80',
    database: 'CODU',
    port: 1433,
  }
}
const knex = require('knex')(knexConfiguration)

Select('emp')
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

module.exports = {
  getTableColumns: function(table){
    return GetTableColumns(table)
  },
  selectTable: function(table){
    Select(table)
  },
  insertTable:function(table,data){
    Insert(table,data)
  },
  updateTable:function(table,target,data){
    Update(table,target,data)
  },
  deleteTable:function(table, targetColumn, targetData){
    Delete(table, targetColumn, targetData)
  }
}