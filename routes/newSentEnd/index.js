var express = require('express');
var router = express.Router();
let database = require('../database/database');

router.get('/', async function(req, res) {
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
  var qry = `SELECT * FROM tow_operator`;
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
	var qry = `
							UPDATE tow_suggest
              SET admin_feedback = '${fb}', reply_time = CURRENT_TIMESTAMP
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
