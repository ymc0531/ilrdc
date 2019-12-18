var express = require('express');
var router = express.Router();
let database = require('../database/database');
let middleware = require('../middleware');

router.get('/', middleware.checkToken, async function(req, res) {
	if(req.decoded.privilege<1)
    res.sendStatus(401)
  else
    res.render('newSentEnd');
});

router.get('/getFamily', async function(req, res) {
  var qry = `SELECT * FROM family`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/getLanguage', async function(req, res) {
	var qry = `SELECT * FROM language`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.get('/getCategory', async function(req, res) {
	var qry = `SELECT cate FROM tow_category`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.get('/operator', async function(req, res) {
  var qry = `SELECT * FROM tow_operator WHERE status < 100`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/operator', async function(req, res) {
  var {family, dialect} = req.body;
  var qry = `
              INSERT INTO tow_operator 
              (family, dialect)
              VALUES ('${family}', '${dialect}');
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/operator', async function(req, res) {
  var {id, name} = req.body;
  var qry = `
              UPDATE tow_operator
              SET username = '${name}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.delete('/operator', async function(req, res) {
  var {id} = req.body;
  var qry = `
              DELETE FROM tow_operator
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/updateOperator', async function(req, res) {
  var {id, sid, pw} = req.body;
  var qry = `
              UPDATE tow_operator
              SET sid = '${sid}', password = '${pw}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/updateOperatorTime', async function(req, res) {
  var {id} = req.body;
  let d = new Date();
  d.setHours(d.getHours() + 8);
  d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  
  var qry = `
              UPDATE tow_operator
              SET last_edit = '${d}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/updateProgress', async function(req, res) {
  var {id, status} = req.body;
  var qry = `
              UPDATE tow_operator
              SET status = '${status}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/statusOperator', async function(req, res) {
  var qry = `
              SELECT * 
              FROM tow_operator
              WHERE status = 100
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/searchOperator', async function(req, res) {
  var {keyword} = req.body;
  var qry = `
              SELECT u.id, u.name_zh, u.name_ind, u.ind_dialect, u.current_addr, t.tribe_zh
              FROM users u
              LEFT JOIN tribes t
              ON u.tribe = t.id
              WHERE name_zh LIKE '%${keyword}%'
              OR name_ind LIKE '%${keyword}%'
              OR identity_num LIKE '%${keyword}%'
              AND privilege >= 2
            `;
  database.conn1.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/dialect', async function(req, res) {
  var {family} = req.body;
  var qry = `SELECT * FROM language WHERE family = '${family}'`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getWords', async function(req, res) {
	var {lang, cate, keyword, level, currpage, rowPerPage} = req.body;
  var limit = 0;
  if(lang.substr(1, lang.length-2)){
    lang = `AND tw.dialect IN (${lang.substr(1, lang.length-2)})`;
  }else{
    lang = '';
  }
  if(cate.substr(1, cate.length-2)){
    cate = `AND tw.category IN (${cate.substr(1, cate.length-2)})`;
  }else{
    cate = '';
  }
  if(keyword&&keyword!=''){
    keyword = `AND (tw.ftws = '${keyword}' OR tw.ctws = '${keyword}')`;
  }else{
    keyword = '';
  }
  //level = ` AND tw.dialect IN (${level.substr(1, level.length-2)})`;
  currpage = parseInt(currpage, 10);
  rowPerPage = parseInt(rowPerPage, 10);
  if(currpage>0) limit = (currpage-1)*rowPerPage;
  var qry = `
              SELECT COUNT(*)
              FROM tow_words tw
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword};
            `;
  var qry1 = `
              SELECT tw.*, lg.family
              FROM tow_words tw
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword}
              ORDER BY tw.id ASC LIMIT ${limit},${rowPerPage};
            `;
  database.conn.query(qry+qry1, function (err, result) {
    res.send(result);
  })
});

router.post('/suggest', async function(req, res) {
  var {lang, cate, keyword, level, currpage, rowPerPage} = req.body;
  var limit = 0;
  if(lang.substr(1, lang.length-2)){
    lang = `AND tw.dialect IN (${lang.substr(1, lang.length-2)})`;
  }else{
    lang = '';
  }
  if(cate.substr(1, cate.length-2)){
    cate = `AND tw.category IN (${cate.substr(1, cate.length-2)})`;
  }else{
    cate = '';
  }
  if(keyword&&keyword!=''){
    keyword = `AND (ts.ftws = '${keyword}' OR ts.ctws = '${keyword}')`;
  }else{
    keyword = '';
  }
  //level = ` AND tw.dialect IN (${level.substr(1, level.length-2)})`;
  currpage = parseInt(currpage, 10);
  rowPerPage = parseInt(rowPerPage, 10);
  if(currpage>0) limit = (currpage-1)*rowPerPage;
  var qry = `
              SELECT COUNT(*)
              FROM tow_suggest ts
              LEFT JOIN tow_words tw ON ts.words_id = tw.id
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword};
            `;
  var qry1 = `
              SELECT tw.*, ts.admin_feedback, ts.suggestion, lg.family, ts.id tsid
              FROM tow_suggest ts
              LEFT JOIN tow_words tw ON ts.words_id = tw.id
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword}
              ORDER BY ts.id ASC LIMIT ${limit},${rowPerPage};
            `;
  database.conn.query(qry+qry1, function (err, result) {
    res.send(result);
  })
});

router.post('/wordsDownload', async function(req, res) {
  var {lang, cate, level} = req.body;
  if(lang&&lang.substr(1, lang.length-2)){
    lang = `AND tw.dialect IN (${lang.substr(1, lang.length-2)})`;
  }else{
    lang = '';
  }
  if(cate&&cate.substr(1, cate.length-2)){
    cate = `AND tw.category IN (${cate.substr(1, cate.length-2)})`;
  }else{
    cate = '';
  }
  //level = ` AND tw.dialect IN (${level.substr(1, level.length-2)})`;
  var qry = `
              SELECT * FROM tow_words tw
              WHERE 1
              ${lang}
              ${cate}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
    console.log(result);
  })
});

router.post('/suggestDownload', async function(req, res) {
  var {lang, cate, level} = req.body;
  if(lang.substr(1, lang.length-2)){
    lang = `AND tw.dialect IN (${lang.substr(1, lang.length-2)})`;
  }else{
    lang = '';
  }
  if(cate.substr(1, cate.length-2)){
    cate = `AND tw.category IN (${cate.substr(1, cate.length-2)})`;
  }else{
    cate = '';
  }
  //level = ` AND tw.dialect IN (${level.substr(1, level.length-2)})`;

  var qry = `
              SELECT tw.sid, lg.family, tw.dialect, tw.category, tw.ftws, tw.ctws, tw.fexam, tw.cexam, ts.suggestion, ts.admin_feedback
              FROM tow_suggest ts
              LEFT JOIN tow_words tw ON ts.words_id = tw.id
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/feedback', async function(req, res) {
	var {id, fb} = req.body;
  let d = new Date();
  d.setHours(d.getHours() + 8);
  d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
	var qry = `
							UPDATE tow_suggest
              SET admin_feedback = '${fb}', reply_time = '${d}'
              WHERE id = ${id}
						`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.delete('/words', async function(req, res) {
  var {id} = req.body;
  var qry = `
              DELETE FROM tow_words
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.delete('/suggest', async function(req, res) {
  var {id} = req.body;
  var qry = `
              DELETE FROM tow_suggest
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

module.exports = router;
