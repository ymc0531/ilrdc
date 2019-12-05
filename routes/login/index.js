var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../config');
let middleware = require('../middleware');
let database = require('../database/database');

router.get('/', async function(req, res) {
  res.render('index');
});

router.get('/test', middleware.checkToken, async function(req, res) {
  res.render('index1');
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

router.get('/dialect', middleware.checkToken, async function(req, res) {
  let qry = `SELECT language FROM language`;
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
    console.log(result);
  });
});

router.post('/login', async function(req, res) {
  let {username, password, privilege} = req.body;
  let qry = `
              SELECT * FROM users_info 
              WHERE username = '${username}' 
              AND password = '${password}'
              AND privilege = ${privilege}
            `
  database.conn.query(qry, function (err, result) {
    if(result.length>0){
      let token = jwt.sign({id: result[0].id, username: result[0].username, privilege: result[0].privilege},
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

module.exports = router;
