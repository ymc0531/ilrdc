const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const ls = require('local-storage');
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "ilrdc_newword"
});
/*var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1qaxsw2",
  database: "ThousandsOfWords",
  multipleStatements: true
});
/*
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "ilrdc"
});
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "ThousandsOfWords",
  multipleStatements: true
});
*/

router.get('/', function(req, res, next) {
  res.render('index', {Alert: '', id: ''});
});

router.get('/sysManage', function(req, res, next) {
  const userName = ls.get('userName');
  const systemPriv = ls.get('systemPriv');
  res.render('dashboard', {user: userName, systemPriv: systemPriv});
});

router.get('/proManage', function(req, res, next) {
  const userName = ls.get('userName');
  const email = ls.get('email');
  const tel = ls.get('tel');
  res.render('user', {user: userName, email: email, tel: tel});
});

router.get('/newWord', function(req, res, next) {
  const userName = ls.get('userName');
  res.render('newWord', {result: "", alert: "", userName: "", qry: ""});
});

router.get('/newWordEdit', function(req, res, next) {
  res.render('newWordEdit', {result: "", alert: "", year: ""});
});

router.get('/newWordAdd', urlencodedParser, function(req, res, next) {
  const qry = "SELECT * FROM newWords_cate";
  try{
    con.connect(function(err) {
      con.query(qry, function (err, result) {
        //console.log(result);
        var cate = {};
        for(var i=0;i<result.length;i++){
          cate[result[i].cate_id] = result[i].cate;
        }
        //console.log(result);
        res.render('newWordAdd', {cate: cate, subcate: result, result: "", alert: "", year: ""});
      });
    });
  } catch(e) {
    res.end("error");
  }
});

router.get('/newSentence', function(req, res, next) {
  const userName = ls.get('userName');
  const qry = "SELECT * FROM family; SELECT * FROM language; SELECT * FROM category;";
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "ThousandsOfWords",
    multipleStatements: true
  });
  conn.connect(function(err) {
    conn.query(qry, function (err, result) {
      res.render('newSentence', {family: result[0], language: result[1], category: result[2], result: [], dsResult: [], ssResult: [], alert: "", userName: userName, deflang: '南勢阿美', defcate: '全分類', isLearn: true, isSearch: false, isSuggest: false});
    });
  });
});

router.get('/newSentence/download/:langcate', function(req, res, next) {
  const langcate = req.params.langcate.split("+");
  const lang = langcate[0];
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "ThousandsOfWords",
    multipleStatements: true
  });
  let cate = langcate[1];
  if(lang == undefined || cate == undefined){
    res.end("無法顯示");
  }else{
    const sql = `SELECT cate_id FROM category WHERE cate = '${cate}'`;
    conn.connect(function(err) {
      conn.query(sql, function (err, result) {
        if(result.length==0&&cate!="全分類"){
          res.end("not available");
        }else{
          if(cate!="全分類"){
            if(result[0].cate_id<10){
              cate = `0${result[0].cate_id}${cate}`;
            }else{
              cate = `${result[0].cate_id}${cate}`;
            }
          }
          if(cate=="全分類"){
            var qry = `SELECT * FROM words WHERE dialect = '${lang}'`;
          }else{
            var qry = `SELECT * FROM words WHERE dialect = '${lang}' AND category = '${cate}'`;
          }
          conn.connect(function(err) {
            conn.query(qry, function (err, result1) {
              res.render('download', {result: result1, category: cate});
            });
          });
        }
      });
    });
  }
});

router.get('/logout', function(req, res, next) {
  ls.remove('userName');
  ls.remove('email');
  ls.remove('tel');
  ls.remove('systemPriv');
  res.render('index', {Alert: '', id: ''});
});

router.post('/newWord/search', urlencodedParser, function(req, res, next) {
  const year = req.body.year;
  const langType = req.body.langtype;
  const chiWord = req.body.chi_word;
  const indWord = req.body.ind_word;
  const userName = ls.get('userName');
  var qry = `SELECT * FROM newWords INNER JOIN language ON newWords.language_id=language.language_id WHERE newWords.language_id = ${langType}`;
  console.log(qry);
  qry += " AND season = "+year;
  if(chiWord!=''){
  	qry += " AND ch = '"+chiWord+"'";
  }
  if(indWord!=''){
  	qry += " AND ab = '"+indWord+"'";
  }
  if(langType!=undefined){
	  try{
		con.connect(function(err) {
			con.query(qry, function (err, result) {
			  res.render('newWord', {result: result, alert: "", userName: userName, qry: qry});
			});
		  });
	  } catch(e) {
	  	res.end("error");
	  }
  } else {
  	res.render('newWord', {result: "", alert: "請選擇語言"});
  }
});

router.post('/newWord/suggest', urlencodedParser, function(req, res, next) {
  const word_id = req.body.word_id;
  const suggest = req.body.suggest;
  const qry = req.body.qry;
  console.log(qry);
  const userName = ls.get('userName');
  var insqry = "INSERT INTO suggest (word_id, username, suggestion) VALUES ";
  insqry += "("+word_id.toString()+",'"+userName+"','"+suggest+"')";
  //console.log(insqry);
  try{
    con.connect(function(err) {
      con.query(insqry, function (err, result) {
        con.connect(function(err) {
          con.query(qry, function (err, result1) {
            //console.log(result1);
            res.render('newWord', {result: result1, alert: "", userName: userName, qry: qry});
          });
        });
      });
    });
  } catch(e) {
    res.end("error");
  }
});

router.post('/newWordEdit/search', urlencodedParser, function(req, res, next) {
  const year = req.body.year;
  const langType = req.body.langtype;
  ls.set('year', year);
  var qry = "SELECT * FROM newWords INNER JOIN language ON newWords.language_id=language.language_id WHERE newWords.language_id = "+langType;
  if(langType!=undefined){
	  try{
  		con.connect(function(err) {
  			con.query(qry, function (err, result) {
          ls.set('result', JSON.stringify(result));
  			  res.render('newWordEdit', {cate: "", subcate: "", result: result, alert: "", year: year});
  			});
  		});
	  } catch(e) {
	  	res.end("error");
	  }
  } else {
  	res.render('newWordEdit', {result: "", alert: "請選擇語言"});
  }
});

router.post('/newWordEdit/edit', urlencodedParser, function(req, res, next) {
  const word_id = req.body.word_id;
  const ab = req.body.ab;
  const ch_mean = req.body.ch_mean;
  const ch_example = req.body.ch_example;
  const ab_example = req.body.ab_example;
  var result = JSON.parse(ls.get('result'));
  var year = parseInt(ls.get('year'), 10);
  var findIndex = result.findIndex(find => find.word_id==parseInt(word_id, 10));
  console.log(req.body);
  result[findIndex].ab = ab;
  result[findIndex].mean = ch_mean;
  result[findIndex].ch_example = ch_example;
  result[findIndex].ab_example = ab_example;
  console.log(result[findIndex].ch_mean);
  var sql = "UPDATE newWords SET ab = '"+ab+"', mean = '"+ch_mean+"', ch_example = '"+ch_example+"', ab_example = '"+ab_example+"' "+"WHERE word_id = "+word_id;
  //res.render('newWordEdit', {result: JSON.parse(result), alert: "", year: year});
  try{
    con.connect(function(err) {
      con.query(sql, function (err, ress) {
        res.render('newWordEdit', {cate: "", subcate: "", result: result, alert: "", year: year});
      });
    });
  } catch(e) {
    res.end("error");
  }
});

router.post('/newWordAdd/insert', urlencodedParser, function(req, res, next) {
  const year = req.body.year;
  const langType = req.body.langtype;
  const cate = parseInt(req.body.cate1, 10);
  const subcate = parseInt(req.body.cate2, 10);
  const ch = req.body.ch;
  const sql = "SELECT * FROM newWords_cate";
  con.connect(function(err) {
    con.query(sql, function (err, res1) {
      var obj = res1.find(obj => obj.cate_id == cate && obj.subcate_id == subcate);
      var sql1 = "INSERT INTO newWords (language_id, season, cate_id, cate, subcate_id, subcate, ch) VALUES ";
      sql1 += "("+langType+","+year.toString()+","+cate.toString()+",'"+obj["cate"]+"',"+subcate.toString()+",'"+obj["subcate"]+"','"+ch+"')";
      //console.log(sql1);
      con.connect(function(err) {
        con.query(sql1, function (err, res2) {
          res.redirect("http://localhost:3030/newWordAdd");
        });
      });
      //res.render('newWordEdit', {cate: "", subcate: "", result: result, alert: "", year: year});
    });
  });
});

router.post('/newSentence/search', urlencodedParser, function(req, res, next) {
  const userName = ls.get('userName');
  const currlang = req.body.currlang;
  const currcate = req.body.currcate;
  const sql = "SELECT * FROM family; SELECT * FROM language; SELECT * FROM category;"
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "ThousandsOfWords",
    multipleStatements: true
  });
  if(currcate!="全分類"){
    var qry = `SELECT cate_id FROM category WHERE cate = '${currcate}'`;
    conn.connect(function(err) {
      conn.query(qry, function (err, result) {
        if(result[0].cate_id.toString().length==1){
          var newcate = `0${result[0].cate_id.toString()}${currcate}`;
        } else {
          var newcate = `${result[0].cate_id.toString()}${currcate}`;
        }
        qry = `${sql} SELECT * FROM words WHERE dialect = '${currlang}' AND category = '${newcate}'`;
        conn.connect(function(err) {
          conn.query(qry, function (err, result1) {
            res.render('newSentence', {family: result1[0], language: result1[1], category: result1[2], result: result1[3], dsResult: [], ssResult: [], alert: "", userName: userName, deflang: currlang, defcate: currcate, isLearn: true, isSearch: false, isSuggest: false});
          });
        });
      });
    });
  } else {
    var qry = `${sql} SELECT * FROM words WHERE dialect = '${currlang}'`
    conn.connect(function(err) {
      conn.query(qry, function (err, result) {
        res.render('newSentence', {family: result[0], language: result[1], category: result[2], result: result[3], dsResult: [], ssResult: [], alert: "", userName: userName, deflang: currlang, defcate: currcate, isLearn: true, isSearch: false, isSuggest: false});
      });
    });
  }
});

router.post('/newSentence/deepSearch', urlencodedParser, function(req, res, next) {
  const userName = ls.get('userName');
  const keyword = req.body.keyword;
  const sql = "SELECT * FROM family; SELECT * FROM language; SELECT * FROM category;"
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "ThousandsOfWords",
    multipleStatements: true
  });
  var qry = `${sql} SELECT * FROM words WHERE ftws LIKE '%${keyword}%'`
  conn.connect(function(err) {
    conn.query(qry, function (err, result) {
      res.render('newSentence', {family: result[0], language: result[1], category: result[2], result: [], dsResult: result[3], ssResult: [], alert: "", userName: userName, deflang: "南勢阿美", defcate: "全分類", isLearn: false, isSearch: true, isSuggest: false});
    });
  });
});

router.post('/newSentence/suggestSearch', urlencodedParser, function(req, res, next) {
  const userName = ls.get('userName');
  const keyword = req.body.keyword;
  const sql = "SELECT * FROM family; SELECT * FROM language; SELECT * FROM category;"
  var qry = `${sql} SELECT * FROM suggest WHERE ftws LIKE '%${keyword}%'`
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "ThousandsOfWords",
    multipleStatements: true
  });
  conn.connect(function(err) {
    conn.query(qry, function (err, result) {
      console.log(result[3]);
      res.render('newSentence', {family: result[0], language: result[1], category: result[2], result: [], dsResult: [], ssResult: result[3], alert: "", userName: userName, deflang: "南勢阿美", defcate: "全分類", isLearn: false, isSearch: false, isSuggest: true});
    });
  });
});

router.post('/newSentence/suggest', urlencodedParser, function(req, res, next) {
  const userName = ls.get('userName');
  const word_id = req.body.id;
  const textftws = req.body.textftws;
  const textctws = req.body.textctws;
  const textfexam = req.body.textfexam;
  const textcexams = req.body.textcexams;
  const textsuggestion = req.body.textsuggestion;
  const sql = "SELECT * FROM family; SELECT * FROM language; SELECT * FROM category;"
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "ThousandsOfWords",
    multipleStatements: true
  });
  var qry = `${sql} INSERT INTO suggest (word_id, ftws, ctws, fexam, cexams, suggestion) VALUES (${word_id}, '${textftws}', '${textctws}', '${textfexam}', '${textcexams}', '${textsuggestion}')`
  conn.connect(function(err) {
    conn.query(qry, function (err, result) {
      res.render('newSentence', {family: result[0], language: result[1], category: result[2], result: [], dsResult: [], ssResult: [], alert: "", userName: userName, deflang: "南勢阿美", defcate: "全分類", isLearn: true, isSearch: false, isSuggest: false});
    });
  });
});

router.post('/login', urlencodedParser, function(req, res, next) {
  const userType = req.body.usertype;
  const userName = req.body.username;
  const passWord = req.body.password;
  let systemPriv = {
  	system_01: "true",
  	system_02: "true",
  	system_03: "true",
  	system_04: "true",
  	system_05: "true",
  };
  ls.set('systemPriv', systemPriv);
  if(userName=="ymc" && passWord=="12345"){
    res.render('dashboard', {user: userName, systemPriv: systemPriv});
  }else{
    res.render('index', {Alert: "帳號或密碼錯誤！", id: userName});
  }
  /*let qry = "SELECT * FROM user WHERE username = "+"'"+userName+"'";
  con.connect(function(err) {
  	if (err) console.log(err);
  	try {
  		con.query(qry, function (err, result) {
  			if (err) {
  				res.render('index', {Alert: "帳號或密碼錯誤！", id: userName});
  			} else {
  				try {
  					if (result[0].type==userType){
		  				if (result[0].password==passWord){
						  	ls.set('userName', result[0].username);
						  	ls.set('email', result[0].email);
						  	ls.set('tel', result[0].tel);
						  	systemPriv.system_01 = result[0].system01;
						  	systemPriv.system_02 = result[0].system02;
						  	systemPriv.system_03 = result[0].system03;
						  	systemPriv.system_04 = result[0].system04;
						  	systemPriv.system_05 = result[0].system05;
					  		ls.set('systemPriv', systemPriv);
					  		res.render('dashboard', {user: userName, systemPriv: systemPriv});
						} else {
							res.render('index', {Alert: "帳號或密碼錯誤！", id: userName});
						};
					} else {
						res.render('index', {Alert: "帳號或密碼錯誤！", id: userName});
					};
				} catch {
					res.render('index', {Alert: "帳號或密碼錯誤！", id: userName});
				};
  			}
  		});
  	} catch (e) {
	  res.render('index', {Alert: "帳號或密碼錯誤！", id: userName});
	};
  });*/
});

module.exports = router;
