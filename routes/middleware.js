let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
  let token = req.cookies.loginToken;
  console.log(token);
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.redirect('/');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.redirect('/');
  }
};

module.exports = {
  checkToken: checkToken
}