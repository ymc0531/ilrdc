var express = require('express');
var router = express.Router();
let database = require('../database/database');
const fs = require('fs');

router.get('/', async function(req, res) {
  res.render('newWord');
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
  var qry = `SELECT * FROM nw_category`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/getSetting', async function(req, res) {
  var qry = `SELECT * FROM nw_setting`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getWord', async function(req, res) {
  var {id} = req.body;
  var qry = `SELECT * FROM nw_words WHERE id = ${id}`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getFeWord', async function(req, res) {
  var tmp = '';
  var {keyword, lang, cate, page} = req.body;
  if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
  if(cate&&cate!='全分類') tmp = `${tmp}AND subcate = '${cate}' `;
  if(keyword&&keyword!='') tmp = `${tmp}AND (ch = '${keyword}' OR ab = '${keyword}') `;
  page = (parseInt(page, 10)-1)*50;

  var qry = `
              SELECT COUNT(*) FROM nw_words 
              WHERE season = (SELECT first_edition_year FROM nw_setting)
              AND checked = 0
              ${tmp};
              SELECT * FROM nw_words 
              WHERE season = (SELECT first_edition_year FROM nw_setting)
              AND checked = 0
              ${tmp}
              ORDER BY cate, subcate, language, ch
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getLcWord', async function(req, res) {
  var tmp = '';
  var {keyword, lang, cate, page} = req.body;
  if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
  if(cate&&cate!='全分類') tmp = `${tmp}AND subcate = '${cate}' `;
  if(keyword&&keyword!='') tmp = `${tmp}AND (ch = '${keyword}' OR ab = '${keyword}') `;
  page = (parseInt(page, 10)-1)*50;

  var qry = `
              SELECT COUNT(*) FROM nw_words 
              WHERE season = (SELECT latest_checked_year FROM nw_setting)
              AND checked = 1
              ${tmp};
              SELECT * FROM nw_words 
              WHERE season = (SELECT latest_checked_year FROM nw_setting)
              AND checked = 1
              ${tmp}
              ORDER BY cate, subcate, language, ch
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getPyWord', async function(req, res) {
  var tmp = '';
  var {keyword, lang, cate, page} = req.body;
  if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
  if(cate&&cate!='全分類') tmp = `${tmp}AND subcate = '${cate}' `;
  if(keyword&&keyword!='') tmp = `${tmp}AND (ch = '${keyword}' OR ab = '${keyword}') `;
  page = (parseInt(page, 10)-1)*50;

  var qry = `
              SELECT COUNT(*) FROM nw_words 
              WHERE season <= (SELECT past_year_from FROM nw_setting)
              AND checked = 1
              ${tmp};
              SELECT * FROM nw_words 
              WHERE season <= (SELECT past_year_from FROM nw_setting)
              AND checked = 1
              ${tmp}
              ORDER BY season DESC, id ASC
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.post('/download', async function(req, res) {
  var {lang, cate} = req.body;
  if(lang!='全語言'){
    lang = `AND dialect = '${lang}'`;
  }else{
    lang = '';
  }
  if(cate!='全分類'){
    cate = `AND subcate = '${cate}'`;
  }else{
    cate = '';
  }
  var qry = `
              SELECT season, language, dialect, cate, subcate, ab, ch, ab_example, ch_example, example_type, remark 
              FROM nw_words
              WHERE 1
              ${lang}
              ${cate}
              ORDER BY cate, subcate, language, ch
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/suggest', async function(req, res) {
  var {page} = req.body;
  page = (parseInt(page, 10)-1)*50;

  var qry = `
              SELECT COUNT(*) FROM nw_suggest;
              SELECT * FROM nw_suggest 
              ORDER BY id 
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.put('/suggest', async function(req, res) {
  var {id, season, dialect, ab, ch, cate, subcate, suggestion, event} = req.body;
  if(event=='1'){
    event = '初版詞彙';
  }else{
    event = '推薦新詞';
  }
  var qry = `
              INSERT INTO 
              nw_suggest (word_id, season, dialect, ab, ch, cate, subcate, suggestion, event) 
              VALUES 
              (${id}, ${season}, '${dialect}', '${ab}', '${ch}', '${cate}', '${subcate}', '${suggestion}', '${event}')
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.get('/files', async function(req, res) {
  let path = '';
  let tmppath = __dirname.split('/');
  tmppath.pop();
  tmppath.pop();
  for(let i=0;i<tmppath.length;i++){
    path += tmppath[i] + '/';
  }
  path += 'public/audio/newWord'
  fs.readdir(path, function(err, items) {
    res.send(items);
  });
});

module.exports = router;
