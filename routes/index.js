let express = require('express');
let router = express.Router();
let database = require('./database/database');

database.conn.connect(function(err){
  if(err) console.log(`database connect error: ${err}`);
});

let login = require('./login');
let newSentence = require('./newSentence');
let newSentEnd = require('./newSentEnd');
let newWord = require('./newWord');

router.use('/', login);
router.use('/newSentence', newSentence);
router.use('/newSentEnd', newSentEnd);
router.use('/newWord', newWord);

module.exports = router;
