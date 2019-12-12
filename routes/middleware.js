let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkLogin = (req, res, next) => {
  let token = req.cookies.loginToken;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        next();
      } else {
        req.decoded = decoded;
        return res.redirect('/user-dashboard');
      }
    });
  } else {
    next();
  }
};

let checkToken = (req, res, next) => {
  let token = req.cookies.loginToken;
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

let checkPrivilege = (req, res, next) => {
  let token = req.cookies.loginToken;
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
  checkLogin: checkLogin,
  checkToken: checkToken,
  checkPrivilege: checkPrivilege
}