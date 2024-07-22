const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// MySQL 최초 연결
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySQL Connected...");
});

// const db = mysql.createPool({
//     connectionLimit: 10,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// db.getConnection((err, connection) => {
//     if (err) throw err; // not connected!
//     // 연결 사용 후 반환
//     connection.release();
// });

module.exports = db;
