var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../config');
let middleware = require('../middleware');
let database = require('../database/database');
const csv = require('fast-csv');
const fs = require('fs');
const multer  = require('multer');
const upload = multer();
const csvjson=require('csvtojson');

router.get('/', async function(req, res) {
  res.render('index');
});

router.get('/user-dashboard', middleware.checkToken, async function(req, res) {
  if(req.decoded.privilege==0)
    res.render('user-dashboard', {user: req.decoded.username});
  else
    res.redirect('/work-dashboard');
});

router.get('/work-dashboard', middleware.checkToken, async function(req, res) {
  if(req.decoded.privilege>0)
    res.render('work-dashboard', {user: req.decoded.username});
  else
    res.redirect('/user-dashboard');
});

router.get('/privilege', middleware.checkToken, async function(req, res) {
  let username = req.decoded.username;
  let qry = `SELECT privilege FROM users_info WHERE username = '${username}'`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  });
});

router.get('/dialect', middleware.checkToken, async function(req, res) {
  let qry = `SELECT language FROM language`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  });
});

router.get('/nw_setting', middleware.checkToken, async function(req, res) {
  let qry = `SELECT * FROM nw_setting`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  });
});

router.put('/nw_setting', middleware.checkToken, async function(req, res) {
  let {fey, fey_1, fey_2, lcy, lcy_1, lcy_2, pyf, pyf_1, pyf_2} = req.body;
  let qry = `
            UPDATE nw_setting 
            SET first_edition_year = '${fey}', latest_checked_year = '${lcy}', past_year_from =  '${pyf}',
            fey_title_row_1 = '${fey_1}', fey_title_row_2 = '${fey_2}',
            lcy_title_row_1 = '${lcy_1}', lcy_title_row_2 = '${lcy_2}',
            py_title_row_1 = '${pyf_1}', py_title_row_2 = '${pyf_2}'
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  });
});

router.get('/user-info', middleware.checkToken, async function(req, res) {
  let imp_id = req.decoded.id;
  let qry = `SELECT * FROM users_info WHERE id = ${imp_id}`;
  database.conn.query(qry, function (err, result) {
    if(result) result[0].password = '';
    res.send(result);
  });
});

router.put('/user-info', middleware.checkToken, async function(req, res) {
  let imp_id = req.decoded.id;
  let imp_username = req.decoded.username;
  let {id, username, email, birthdate, identity_num, gender, name_zh, name_ind, dialect, tribe, mobile_no, office_no, postcode, address} = req.body;
  id = parseInt(id, 10);
  if(imp_id==id&&imp_username==username) {
    let qry = `
                UPDATE users_info
                SET email = '${email}', birthdate = '${birthdate}', 
                    identity_num = '${identity_num}', gender = '${gender}', 
                    name_zh = '${name_zh}', name_ind = '${name_ind}', 
                    ind_dialect = '${dialect}', tribe = '${tribe}', 
                    mobile_no = '${mobile_no}', office_no = '${office_no}', 
                    current_postcode = '${postcode}', current_addr = '${address}'
                WHERE id = ${imp_id};
              `;
    database.conn.query(qry, function (err, result) {
      res.send(result);
    });
  }else{
    res.send('err');
  }
});

router.put('/user', middleware.checkToken, async function(req, res) {
  let {type, username, password} = req.body;
  let tmp;
  switch(type) {
    case '一般':
      tmp = 0;
      break;
    case '機關':
      tmp = 1;
      break;
    case '工作':
      tmp = 2;
      break;
  }
  let qry = `
              INSERT INTO users_info
              (username, password, privilege)
              VALUES ('${username}', '${password}', '${tmp}')
            `;
  if(req.decoded.privilege>90) {
    database.conn.query(qry, function (err, result) {
      if(err) res.sendStatus(400);
      else res.sendStatus(200);
    });
  }else{
    res.sendStatus(403);
  }
});

router.post('/usersUpload', upload.single('csvFile'), middleware.checkToken, async function(req, res) {
  let tmprow, qry, row;
  let colNum;
  let sqlVal = '';
  console.log(req.file);
  csvjson({
      noheader:true,
      output: "csv"
  })
  .fromString(req.file.buffer.toString())
  .then((csvRow)=>{
    colNum = csvRow[0].length;
    if(colNum!=2) {
      res.sendStatus(400);
    }else{
      for(let i=1;i<csvRow.length;i++) {
        tmprow = csvRow[i];
        tmprow.push(csvRow[i][1].substr(csvRow[i][1].length-5));
        row = JSON.stringify(tmprow);
        sqlVal = `${sqlVal},(${row.substr(1,row.length-2)})`;
      }
      sqlVal = sqlVal.substr(1,sqlVal.length);
      console.log(sqlVal);
      qry = `
              INSERT INTO users_info 
              (username, identity_num, password)
              VALUES
              ${sqlVal}
            `;
      if(req.decoded.privilege>90) {
        database.conn.query(qry, function (err, result) {
          if(err) res.sendStatus(400);
          else res.sendStatus(200);
        });
      }else{
        res.sendStatus(403);
      }
    }
  })
});


router.post('/users', middleware.checkToken, async function(req, res) {
  let {page, type} = req.body;
  let tmp;
  switch(type) {
    case '全部':
      tmp = '';
      break;
    case '一般':
      tmp = 'AND privilege = 0';
      break;
    case '機關':
      tmp = 'AND privilege = 1';
      break;
    case '工作':
      tmp = 'AND privilege = 2';
      break;
    case '黑名單':
      tmp = 'AND status = 0';
      break;
  }
  page = (parseInt(page, 10)-1)*15;
  let qry = `
              SELECT COUNT(*) FROM users_info
              WHERE 1
              ${tmp};
              SELECT id, username, identity_num, name_zh, name_ind, status
              FROM users_info
              WHERE 1
              ${tmp}
              ORDER BY id
              LIMIT ${page}, 15
            `;
  if(req.decoded.privilege>90) {
    database.conn.query(qry, function (err, result) {
      res.send(result);
    })
  }else{
    res.sendStatus(403);
  }
});

router.put('/status', middleware.checkToken, async function(req, res) {
  let {id, status} = req.body;
  let qry = `
              UPDATE users_info 
              SET status = '${status}'
              WHERE id = ${id}
            `;
  if(req.decoded.privilege>90) {
    database.conn.query(qry, function (err, result) {
      res.send(result);
    })
  }else{
    res.sendStatus(403);
  }
});

router.put('/password', middleware.checkToken, async function(req, res) {
  let imp_id = req.decoded.id;
  let {old_pw, new_pw} = req.body;
  let qry = `
              UPDATE users_info 
              SET password = '${new_pw}'
              WHERE id = ${imp_id}
              AND password = '${old_pw}'
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  });
});

router.post('/login', async function(req, res) {
  let {username, password, privilege} = req.body;
  if(username=='admin') privilege = 99;
  let qry = `
              SELECT * FROM users_info 
              WHERE username = '${username}' 
              AND password = '${password}'
              AND privilege = ${privilege}
              AND status = 1
            `
  database.conn.query(qry, function (err, result) {
    if(result.length>0){
      let token = jwt.sign({id: result[0].id, username: result[0].username, name: result[0].name_zh, privilege: result[0].privilege},
        config.secret,
        { 
          expiresIn: '24h'
        }
      );
      res.send(token);
    }else{
      res.send(false);
    }
  });
});

router.post('/uploadTow', upload.single('csvFile'), async function(req, res) {
  let qry, row;
  let colNum;
  let sqlVal = '';
  csvjson({
      noheader:true,
      output: "csv"
  })
  .fromString(req.file.buffer.toString())
  .then((csvRow)=>{
    colNum = csvRow[0].length;
    if(colNum!=13) {
      res.sendStatus(400);
    }else{
      for(let i=1;i<csvRow.length;i++) {
        row = JSON.stringify(csvRow[i]);
        sqlVal = `${sqlVal},(${row.substr(1,row.length-2)})`;
      }
      sqlVal = sqlVal.substr(1,sqlVal.length);
      qry = `
              INSERT INTO tow_words 
              (sid, dialect, category, snum, ftws, ctws, fexam, cexam, LanLevelE, LanLevelM, LanLevelMH, LanLevelH, memo)
              VALUES
              ${sqlVal}
            `;
      database.conn.query(qry, function (err, result) {
        if(err) res.sendStatus(400);
        else res.sendStatus(200);
      });
    }
  })
});

router.post('/uploadNw', upload.single('csvFile'), async function(req, res) {
  let qry, row;
  let colNum;
  let sqlVal = '';
  csvjson({
      noheader:true,
      output: "csv"
  })
  .fromString(req.file.buffer.toString())
  .then((csvRow)=>{
    colNum = csvRow[0].length;
    if(colNum!=14) {
      res.sendStatus(400);
    }else{
      for(let i=1;i<csvRow.length;i++) {
        row = JSON.stringify(csvRow[i]);
        sqlVal = `${sqlVal},(${row.substr(1,row.length-2)})`;
      }
      sqlVal = sqlVal.substr(1,sqlVal.length);
      qry = `
              INSERT INTO nw_words 
              (season, language, dialect, cate, subcate, ch, ab, mean, description, word_formation, ch_example, ab_example, example_type, remark)
              VALUES
              ${sqlVal}
            `;
      database.conn.query(qry, function (err, result) {
        if(err) res.sendStatus(400);
        else res.sendStatus(200);
      });
    }
  })
});

router.post('/uploadAr', upload.single('csvFile'), async function(req, res) {
  let qry, row;
  let colNum;
  let sqlVal = '';
  csvjson({
      noheader:true,
      output: "csv"
  })
  .fromString(req.file.buffer.toString())
  .then((csvRow)=>{
    colNum = csvRow[0].length;
    if(colNum!=11) {
      res.sendStatus(400);
    }else{
      for(let i=1;i<csvRow.length;i++) {
        row = JSON.stringify(csvRow[i]);
        sqlVal = `${sqlVal},(${row.substr(1,row.length-2)})`;
      }
      sqlVal = sqlVal.substr(1,sqlVal.length);
      qry = `
              INSERT INTO nw_articles 
              (season, language, dialect, cate, sid, name, paragraph, ab_content, ch_content, ab_keyword, ch_keyword)
              VALUES
              ${sqlVal}
            `;
      database.conn.query(qry, function (err, result) {
        if(err) res.sendStatus(400);
        else res.sendStatus(200);
      });
    }
  })
});

module.exports = router;
