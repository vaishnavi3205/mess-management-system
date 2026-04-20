const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9503",
  database: "smart_mess",
});

module.exports = db;