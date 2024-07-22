const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "project-db-stu3.smhrd.com",
    port: 3307,
    user: "Insa5_JSA_hacksim_4",
    password: "aischool4",
    database: "Insa5_JSA_hacksim_4",
});

// MySQL 최초 연결
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySQL Connected...");
});

module.exports = db;
