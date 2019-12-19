let express = require('express');
let router = express.Router();
let database = require('../database/database');
let middleware = require('../middleware');
const fs = require('fs');

router.get('/', async function(req, res) {
  res.render('newWord');
});

router.get('/getFamily', async function(req, res) {
  let qry = `SELECT * FROM family`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/getLanguage', async function(req, res) {
  let qry = `SELECT * FROM language`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/getCategory', async function(req, res) {
  let qry = `SELECT * FROM nw_category`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/getSetting', async function(req, res) {
  let qry = `SELECT * FROM nw_setting`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getWord', async function(req, res) {
  let {id} = req.body;
  let qry = `SELECT * FROM nw_words WHERE id = ${id}`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getFeWord', async function(req, res) {
  let tmp = '';
  let {keyword, lang, cate, page, blurSearch} = req.body;
  if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
  if(cate&&cate!='全分類') tmp = `${tmp}AND subcate = '${cate}' `;
  if(keyword&&keyword!='') {
    if(blurSearch=='false') {
      tmp = `${tmp}AND (ch = '${keyword}' OR ab = '${keyword}') `;
    }else{
      tmp = `${tmp}AND (ch LIKE '%${keyword}%' OR ab LIKE '%${keyword}%') `;
    }
  }
  page = (parseInt(page, 10)-1)*50;

  let qry = `
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
  let tmp = '';
  let {keyword, lang, cate, page, blurSearch} = req.body;
  if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
  if(cate&&cate!='全分類') tmp = `${tmp}AND subcate = '${cate}' `;
  if(keyword&&keyword!='') {
    if(blurSearch=='false') {
      tmp = `${tmp}AND (ch = '${keyword}' OR ab = '${keyword}') `;
    }else{
      tmp = `${tmp}AND (ch LIKE '%${keyword}%' OR ab LIKE '%${keyword}%') `;
    }
  }
  page = (parseInt(page, 10)-1)*50;

  let qry = `
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
  let tmp = '';
  let {keyword, lang, cate, page, blurSearch} = req.body;
  if(lang&&lang!='全語言') tmp = `${tmp}AND dialect = '${lang}' `;
  if(cate&&cate!='全分類') tmp = `${tmp}AND subcate = '${cate}' `;
  if(keyword&&keyword!='') {
    if(blurSearch=='false') {
      tmp = `${tmp}AND (ch = '${keyword}' OR ab = '${keyword}') `;
    }else{
      tmp = `${tmp}AND (ch LIKE '%${keyword}%' OR ab LIKE '%${keyword}%') `;
    }
  }
  page = (parseInt(page, 10)-1)*50;

  let qry = `
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
  let {lang, cate} = req.body;
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
  let qry = `
              SELECT season, language, dialect, cate, subcate, ab, ch, word_formation, ab_example, ch_example, example_type, remark 
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
  let {page} = req.body;
  page = (parseInt(page, 10)-1)*50;

  let qry = `
              SELECT COUNT(*) FROM nw_suggest;
              SELECT * FROM nw_suggest 
              ORDER BY id DESC 
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.put('/suggest', middleware.checkLogin2, async function(req, res) {
  let username = '';
  let {id, season, dialect, ab, ch, cate, subcate, suggestion, event, hideUser} = req.body;
  if(req.decoded) username = req.decoded.name;
  if(req.decoded.name=='') username = req.decoded.username;
  if(hideUser=='true') username = `*${username}`;

  if(event=='1'){
    event = '初版詞彙';
  }else{
    event = '推薦新詞';
  }
  let qry = `
              INSERT INTO 
              nw_suggest (word_id, username, season, dialect, ab, ch, cate, subcate, suggestion, event) 
              VALUES 
              ('${id}', '${username}', '${season}', '${dialect}', '${ab}', '${ch}', '${cate}', '${subcate}', '${suggestion}', '${event}')
            `;
  if(req.decoded) {
    database.conn.query(qry, function (err, result) {
      if(err) res.sendStatus(400);
      else res.sendStatus(200);
    })
  }else{
    res.sendStatus(401);
  }
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
