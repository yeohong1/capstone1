const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pqlamz31',
    port: 3306,
    database: 'memo',
});




function get_connection() {
    return connection;
}

function getAllMemos(callback, username) {
    connection.query(`SELECT * FROM MEMOS WHERE username='${username}' ORDER BY ID DESC`, (err, rows, fields) => {
        if (err) throw err;
        callback(rows);
    });
}

function getMemoById(id, callback) {
    connection.query(`SELECT * FROM MEMOS WHERE ID=${id}`, (err, row, fields) => {
        if (err) throw err;
        callback(row);
    });
}

// 연결 닫기
function closeConnection() {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
            return;
        }
        console.log('Closed MySQL connection');
    });
}

module.exports = {
    getAllMemos,
    getMemoById,
    get_connection,
    closeConnection,
};
