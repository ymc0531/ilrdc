let express = require('express');
let router = express.Router();
let database = require('./database/database');

database.conn.connect(function(err){
  if(err) console.log(`database connect error: ${err}`);
});

let login = require('./login');
let newSentence = require('./newSentence');
let newSentEnd = require('./newSentEnd');

router.use('/', login);
router.use('/newSentence', newSentence);
router.use('/newSentEnd', newSentEnd);


module.exports = router;
