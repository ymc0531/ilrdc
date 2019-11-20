const mysql = require('mysql');

var con1 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "ThousandsOfWords",
  multipleStatements: true
});

module.exports = {
  con1: con1
}
