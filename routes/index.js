let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');
let database = require('./database/database');

database.conn.connect(function(err){
  if(err) console.log(`database connect error: ${err}`);
});

let newSentence = require('./newSentence');
let newSentEnd = require('./newSentEnd');

router.use('/newSentence', newSentence);
router.use('/newSentEnd', newSentEnd);

router.get('/', async function(req, res) {
  res.render('index');
});

router.get('/test', middleware.checkToken, async function(req, res) {
  res.render('index1');
});

router.post('/login', async function(req, res) {
  let {username, password} = req.body;
  let qry = `SELECT * FROM users_info WHERE username = '${username}' AND password = '${password}'`
  database.conn.query(qry, function (err, result) {
    if(result.length>0){
      let token = jwt.sign({username: username},
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
