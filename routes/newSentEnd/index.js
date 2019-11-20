var express = require('express');
var router = express.Router();
let database = require('../database/database1');

router.get('/', async function(req, res) {
	res.render('newSentEnd');
});

router.get('/test', async function(req, res) {
	var qry = `SELECT * FROM family`;
  database.con1.query(qry, function (err1, result) {
  	if(err1) console.log(err1);
  	res.send(result);
  })
});

router.get('/getFamily', async function(req, res) {
	var qry = `SELECT * FROM family`;
  database.con1.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.get('/getLanguage', async function(req, res) {
	var qry = `SELECT * FROM language`;
  database.con1.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.get('/getCategory', async function(req, res) {
	var qry = `SELECT * FROM category`;
  database.con1.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.get('/getSuggest', async function(req, res) {
	var qry = `SELECT * FROM suggest`;
  database.con1.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.post('/getWords', async function(req, res) {
	var tmp = ' ';
	var limit = 0;
	var {lang, cate, keyword, blurSearch, pages} = req.body;
	if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
	if(cate&&cate!='全分類') tmp = `${tmp}AND category = '${cate}' `;
	if(keyword&&keyword!='') {
		if(blurSearch=='false') {
			tmp = `${tmp}AND (ftws = '${keyword}' OR ctws = '${keyword}') `;
		}else{
			tmp = `${tmp}AND (ftws LIKE '%${keyword}%' OR ctws LIKE '%${keyword}%') `;
		}
	}
	if(pages>0) limit = (pages-1)*50;
	var qry = `SELECT COUNT(*) FROM words WHERE 1${tmp};SELECT * FROM words WHERE 1${tmp} ORDER BY sid ASC LIMIT ${limit},50`;
  database.con1.query(qry, function (err1, result) {
  	if(err1) console.log(err1);
  	res.send(result);
  })
});

router.put('/suggest', async function(req, res) {
	var {words_id, ftws, ctws, fexam, cexam, suggestion} = req.body;
	console.log(req.body);
	var qry = `
							INSERT INTO 
							suggest (words_id, ftws, ctws, fexam, cexam, suggestion) 
						 	VALUES 
						 	('${words_id}', '${ftws}', '${ctws}', '${fexam}', '${cexam}', '${suggestion}')
						`;
  database.con1.query(qry, function (err, result) {
  	res.send(result);
  })
});

module.exports = router;
