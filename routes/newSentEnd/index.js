let express = require('express');
let router = express.Router();
let database = require('../database/database');
let middleware = require('../middleware');

router.get('/', middleware.checkToken, async function(req, res) {
	if(req.decoded.privilege<1)
    res.sendStatus(401)
  else
    res.render('newSentEnd');
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
	let qry = `SELECT cate FROM tow_category`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.get('/operator', async function(req, res) {
  let qry = `SELECT * FROM tow_operator WHERE status < 100`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/operator', async function(req, res) {
  let {family, dialect} = req.body;
  let qry = `
              INSERT INTO tow_operator 
              (family, dialect)
              VALUES ('${family}', '${dialect}');
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/operator', async function(req, res) {
  let {id, name} = req.body;
  let qry = `
              UPDATE tow_operator
              SET username = '${name}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.delete('/operator', async function(req, res) {
  let {id} = req.body;
  let qry = `
              DELETE FROM tow_operator
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/updateOperator', async function(req, res) {
  let {id, sid, pw} = req.body;
  let qry = `
              UPDATE tow_operator
              SET sid = '${sid}', password = '${pw}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/updateOperatorTime', async function(req, res) {
  let {id} = req.body;
  let d = new Date();
  d.setHours(d.getHours() + 8);
  d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  
  let qry = `
              UPDATE tow_operator
              SET last_edit = '${d}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/updateProgress', async function(req, res) {
  let {id, status} = req.body;
  let qry = `
              UPDATE tow_operator
              SET status = '${status}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/statusOperator', async function(req, res) {
  let qry = `
              SELECT * 
              FROM tow_operator
              WHERE status = 100
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/searchOperator', async function(req, res) {
  let {keyword} = req.body;
  let qry = `
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
  let {family} = req.body;
  let qry = `SELECT * FROM language WHERE family = '${family}'`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getWord', async function(req, res) {
  let {id} = req.body;
  let qry = `SELECT * FROM tow_words WHERE id = '${id}'`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/getWords', async function(req, res) {
  let tmp = '';
	let {lang, cate, keyword, level, currpage, rowPerPage} = req.body;
  let limit = 0;
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
  if(level&&level!=''&&level.length>2){
    level = level.substr(1, level.length-2);
    level = level.split('"').join('');
    level = level.split(',');
    for(let i=0;i<level.length;i++) {
      if(level[i]=='初級') tmp = `${tmp} LanlevelE = '1' OR`;
      if(level[i]=='中級') tmp = `${tmp} LanlevelM = '1' OR`;
      if(level[i]=='中高級') tmp = `${tmp} LanlevelMH = '1' OR`;
      if(level[i]=='高級') tmp = `${tmp} LanlevelH = '1' OR`;
    }
    tmp = tmp.substr(0, tmp.length-3);
    if(level.length<4)
      level = `AND (${tmp} )`;
    else 
      level = '';
  }else{
    level = '';
  }
  currpage = parseInt(currpage, 10);
  rowPerPage = parseInt(rowPerPage, 10);
  if(currpage>0) limit = (currpage-1)*rowPerPage;
  let qry = `
              SELECT COUNT(*)
              FROM tow_words tw
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword}
              ${level};
            `;
  let qry1 = `
              SELECT tw.*, lg.family
              FROM tow_words tw
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword}
              ${level}
              ORDER BY tw.id ASC LIMIT ${limit},${rowPerPage};
            `;
  database.conn.query(qry+qry1, function (err, result) {
    res.send(result);
  })
});

router.post('/suggest', async function(req, res) {
  let tmp = '';
  let {lang, cate, keyword, level, currpage, rowPerPage} = req.body;
  let limit = 0;
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
  if(level&&level!=''&&level.length>2){
    level = level.substr(1, level.length-2);
    level = level.split('"').join('');
    level = level.split(',');
    for(let i=0;i<level.length;i++) {
      if(level[i]=='初級') tmp = `${tmp} LanlevelE = '1' OR`;
      if(level[i]=='中級') tmp = `${tmp} LanlevelM = '1' OR`;
      if(level[i]=='中高級') tmp = `${tmp} LanlevelMH = '1' OR`;
      if(level[i]=='高級') tmp = `${tmp} LanlevelH = '1' OR`;
    }
    tmp = tmp.substr(0, tmp.length-3);
    if(level.length<4)
      level = `AND (${tmp} )`;
    else 
      level = '';
  }else{
    level = '';
  }

  currpage = parseInt(currpage, 10);
  rowPerPage = parseInt(rowPerPage, 10);
  if(currpage>0) limit = (currpage-1)*rowPerPage;
  let qry = `
              SELECT COUNT(*)
              FROM tow_suggest ts
              LEFT JOIN tow_words tw ON ts.words_id = tw.id
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword}
              ${level};
            `;
  let qry1 = `
              SELECT tw.*, ts.admin_feedback, ts.suggestion, lg.family, ts.id tsid
              FROM tow_suggest ts
              LEFT JOIN tow_words tw ON ts.words_id = tw.id
              LEFT JOIN language lg ON tw.dialect = lg.language
              WHERE 1
              ${lang}
              ${cate}
              ${keyword}
              ${level}
              ORDER BY ts.id ASC LIMIT ${limit},${rowPerPage};
            `;
  database.conn.query(qry+qry1, function (err, result) {
    res.send(result);
  })
});

router.post('/wordsDownload', async function(req, res) {
  let {lang, cate, level} = req.body;
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
  let qry = `
              SELECT * FROM tow_words tw
              WHERE 1
              ${lang}
              ${cate}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/suggestDownload', async function(req, res) {
  let {lang, cate, level} = req.body;
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

  let qry = `
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
	let {id, fb} = req.body;
  let d = new Date();
  d.setHours(d.getHours() + 8);
  d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
	let qry = `
							UPDATE tow_suggest
              SET admin_feedback = '${fb}', reply_time = '${d}'
              WHERE id = ${id}
						`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.put('/word', async function(req, res) {
  let tmp;
  let le = `LanlevelE = '0'`;
  let lm = `LanlevelM = '0'`;
  let lmh = `LanlevelMH = '0'`;
  let lh = `LanlevelH = '0'`;
  let {id, level, fexam, cexam, memo} = req.body;
  if(level=='初級') le = le.replace('0', '1');
  if(level=='中級') lm = lm.replace('0', '1');
  if(level=='中高級') lmh = lmh.replace('0', '1');
  if(level=='高級') lh = lh.replace('0', '1');
  level = `${le}, ${lm}, ${lmh}, ${lh}`;
  let qry = `
              UPDATE tow_words
              SET fexam = '${fexam}', cexam = '${cexam}', memo = '${memo}', ${level}
              WHERE id = '${id}'
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.delete('/words', async function(req, res) {
  let {id} = req.body;
  let qry = `
              DELETE FROM tow_words
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.delete('/suggest', async function(req, res) {
  let {id} = req.body;
  let qry = `
              DELETE FROM tow_suggest
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

module.exports = router;
