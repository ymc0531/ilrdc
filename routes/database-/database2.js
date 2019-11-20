const mysql = require('mysql');

var con2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "ilrdc",
  multipleStatements: true
});

module.exports = {
  con2: con2
}
