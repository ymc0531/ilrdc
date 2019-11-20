const mysql = require('mysql');

var con1 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1qazxsw2",
  database: "ThousandsOfWords",
  multipleStatements: true
});

module.exports = {
  con1: con1
}
