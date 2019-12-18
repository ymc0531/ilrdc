var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../config');
let middleware = require('../middleware');
let database = require('../database/database');
let bcrypt = require('bcryptjs');
let mysql = require('mysql');
const csv = require('fast-csv');
const fs = require('fs');
const multer  = require('multer');
const upload = multer();
const csvjson=require('csvtojson');

const en_cert = fs.readFileSync('/Users/ymc/Documents/ilrdc/config/private_key.pem');
const de_cert = fs.readFileSync('/Users/ymc/Documents/ilrdc/config/public_key.pem');
const sign_options = {algorithm:'RS256', issuer:'ilrdc', audience:'ilrdc', expiresIn:'1d'};
const SALTROUNDS = 10;

router.get('/', async function(req, res) {
  res.render('index');
});

router.get('/test', async function(req, res) {
  const hashedPassword = await hashPassword('12345');
  console.log(hashedPassword);
  res.send('ok');
});

router.get('/user-dashboard', middleware.checkToken, async function(req, res) {
  if(req.decoded.privilege==0)
    res.render('user-dashboard', {user: req.decoded.name});
  else
    res.redirect('/work-dashboard');
});

router.get('/work-dashboard', middleware.checkToken, async function(req, res) {
  if(req.decoded.privilege>0)
    res.render('work-dashboard', {user: req.decoded.name});
  else
    res.redirect('/user-dashboard');
});

router.get('/privilege', middleware.checkToken, async function(req, res) {
  let username = req.decoded.username;
  let qry = `SELECT privilege FROM users WHERE username = '${username}'`;
  database.conn1.query(qry, function (err, result) {
    res.send(result);
  });
});

router.get('/language', middleware.checkToken, async function(req, res) {
  let qry = `
              SELECT id, ethnicity FROM ethnicities;
              SELECT id, dialect_zh FROM dialects;
              SELECT id, tribe_zh FROM tribes ORDER BY tribe_zh;
            `;
  database.conn1.query(qry, function (err, result) {
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
  let qry = `SELECT * FROM users WHERE id = ${imp_id}`;
  database.conn1.query(qry, function (err, result) {
    if(result) result[0].password = '';
    res.send(result);
  });
});

router.put('/user-info', middleware.checkToken, async function(req, res) {
  let imp_id = req.decoded.id;
  let imp_username = req.decoded.username;
  let {id, username, email, birthdate, identity_num, gender, name_zh, name_ind, ethnicity, dialect, tribe, mobile_no, office_no, postcode, address} = req.body;
  id = parseInt(id, 10);
  if(imp_id==id&&imp_username==username) {
    let qry = `
                UPDATE users
                SET email = '${email}', birthdate = '${birthdate}', 
                    identity_num = '${identity_num}', gender = '${gender}', 
                    name_zh = '${name_zh}', name_ind = '${name_ind}', 
                    ethnicity = '${ethnicity}', ind_dialect = '${dialect}', tribe = '${tribe}', 
                    mobile_no = '${mobile_no}', office_no = '${office_no}', 
                    current_postcode = '${postcode}', current_addr = '${address}'
                WHERE id = ${imp_id};
              `;
    database.conn1.query(qry, function (err, result) {
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
              INSERT INTO users
              (username, password, privilege, status)
              VALUES ('${username}', '${password}', '${tmp}', 1)
            `;
  if(req.decoded.privilege>90) {
    database.conn1.query(qry, function (err, result) {
      if(err) res.sendStatus(400);
      else res.sendStatus(200);
    });
  }else{
    res.sendStatus(403);
  }
});

router.post('/usersUpload', upload.single('csvFile'), middleware.checkToken, async function(req, res) {
  let tmppw, tmprow, qry, row;
  let colNum;
  let sqlVal = '';
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
      (async () => {
        for(let i=1;i<csvRow.length;i++) {
          tmprow = csvRow[i];
          tmppw = await hashPassword(csvRow[i][1].substr(csvRow[i][1].length-5));
          tmprow.push(tmppw);
          row = JSON.stringify(tmprow);
          sqlVal = `${sqlVal},(${row.substr(1,row.length-2)}, 1)`;
        }
        sqlVal = sqlVal.substr(1,sqlVal.length);
        qry = `
                INSERT INTO users 
                (username, identity_num, password, status)
                VALUES
                ${sqlVal}
              `;
        console.log(qry);
        if(req.decoded.privilege>90) {
          database.conn1.query(qry, function (err, result) {
            if(err) res.sendStatus(400);
            else res.sendStatus(200);
          });
        }else{
          res.sendStatus(403);
        }
      })()
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
              SELECT COUNT(*) FROM users
              WHERE 1
              ${tmp};
              SELECT id, username, identity_num, name_zh, name_ind, status
              FROM users
              WHERE 1
              ${tmp}
              ORDER BY id
              LIMIT ${page}, 15
            `;
  if(req.decoded.privilege>90) {
    database.conn1.query(qry, function (err, result) {
      res.send(result);
    })
  }else{
    res.sendStatus(403);
  }
});

router.put('/status', middleware.checkToken, async function(req, res) {
  let {id, status} = req.body;
  let qry = `
              UPDATE users 
              SET status = '${status}'
              WHERE id = ${id}
            `;
  if(req.decoded.privilege>90) {
    database.conn1.query(qry, function (err, result) {
      res.send(result);
    })
  }else{
    res.sendStatus(403);
  }
});

router.put('/password', middleware.checkToken, async function(req, res) {
  let imp_id = req.decoded.id;
  let {old_pw, new_pw} = req.body;
  /*let qry = `
              UPDATE users
              SET password = '${new_pw}'
              WHERE id = ${imp_id}
              AND password = '${old_pw}'
            `;*/
  let qry = `
              SELECT password FROM users
              WHERE id = ${imp_id}
            `;
  database.conn1.query(qry, function (err, result) {
    if(result&&result.length>0){
      (async () => {
        let checked = await checkPassword(old_pw, result[0].password);
        if(checked) {
          new_pw = await hashPassword(new_pw);
          qry = `
                  UPDATE users
                  SET password = '${new_pw}'
                  WHERE id = ${imp_id}
                `;
          database.conn1.query(qry, function (err, result) {
            res.sendStatus(200);
          });
        }else{
          res.sendStatus(400);
        }
      })()
    }else{
      res.sendStatus(400);
    }
  });
});

router.post('/login', async function(req, res) {
  let tmp = '=';
  let {username, password, privilege} = req.body;
  if(privilege==2) tmp = '>=';
  let qry = `
              SELECT * FROM users 
              WHERE username = '${username}'
              AND privilege ${tmp} ${privilege}
              AND status >= 1
            `;
  /*let d = new Date();
  d.setHours(d.getHours() + 8);
  d = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  */
  database.conn1.query(qry, function (err, result) {
    if(password&&result&&result.length>0) {
      (async () => {
        const checkedPassword = await checkPassword(password, result[0].password);
        if(checkedPassword){
          let token = jwt.sign({id: result[0].id, username: result[0].username, name: result[0].name_zh, privilege: result[0].privilege, for: 'login', status: result[0].status, email: result[0].username},
            en_cert,
            sign_options
          );
          console.log(token);
          res.send(token);
          qry = `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${result[0].id}`
          database.conn1.query(qry, function (err, result) {
          });
        }else{
          res.send(false);
        }
      })()
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


async function hashPassword (password) {

  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

async function checkPassword (password, hpassword) {

  const checkedPassword = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hpassword, function(err, res) {
        if (err) reject(err);
        resolve(res);
    });
  });

  return checkedPassword;
}




module.exports = router;
