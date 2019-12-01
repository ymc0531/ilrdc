var express = require('express');
var router = express.Router();
let database = require('../database/database');

router.get('/', async function(req, res) {
	res.render('newSentence');
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
	var qry = `SELECT * FROM tow_category`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.post('/getSuggest', async function(req, res) {
  var limit = 0;
  var {pages, rowPerPage} = req.body;
  pages = parseInt(pages, 10);
  rowPerPage = parseInt(rowPerPage, 10);
  if(pages>0) limit = (pages-1)*rowPerPage;
	var qry = `SELECT COUNT(*) FROM tow_suggest;SELECT * FROM tow_suggest ORDER BY id ASC LIMIT ${limit},${rowPerPage}`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
    //console.log(err);
  })
});

router.post('/getWords', async function(req, res) {
	var tmp = ' ';
	var limit = 0;
	var {lang, cate, keyword, blurSearch, pages, rowPerPage} = req.body;
	if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
	if(cate&&cate!='全分類') tmp = `${tmp}AND category = '${cate}' `;
	if(keyword&&keyword!='') {
		if(blurSearch=='false') {
			tmp = `${tmp}AND (ftws = '${keyword}' OR ctws = '${keyword}') `;
		}else{
			tmp = `${tmp}AND (ftws LIKE '%${keyword}%' OR ctws LIKE '%${keyword}%') `;
		}
	}
	if(pages>0) limit = (pages-1)*rowPerPage;
	var qry = `SELECT COUNT(*) FROM tow_words WHERE 1${tmp};SELECT * FROM tow_words WHERE 1${tmp} ORDER BY id ASC LIMIT ${limit},${rowPerPage}`;
  database.conn.query(qry, function (err1, result) {
  	if(err1) console.log(err1);
  	res.send(result);
  })
});

router.post('/wordsDownload', async function(req, res) {
  var {lang, cate} = req.body;
  if(lang!='全語言'){
    lang = `AND dialect = '${lang}'`;
  }else{
    lang = '';
  }
  if(cate!='全分類'){
    cate = `AND category = '${cate}'`;
  }else{
    cate = '';
  }
  var qry = `
              SELECT dialect, category, ftws, ctws, fexam, cexam, memo 
              FROM tow_words
              WHERE 1
              ${lang}
              ${cate}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/suggest', async function(req, res) {
	var {words_id, ftws, ctws, fexam, cexam, suggestion} = req.body;
	var qry = `
							INSERT INTO 
							tow_suggest (words_id, ftws, ctws, fexam, cexam, suggestion) 
						 	VALUES 
						 	('${words_id}', '${ftws}', '${ctws}', '${fexam}', '${cexam}', '${suggestion}')
						`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

module.exports = router;
