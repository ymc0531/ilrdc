let jwt = require('jsonwebtoken');
const config = require('./config.js');
const fs = require('fs');
const en_cert = fs.readFileSync(`${config.path}/config/private_key.pem`);
const de_cert = fs.readFileSync(`${config.path}/config/public_key.pem`);

let checkLogin = (req, res, next) => {
  let token = req.cookies.loginToken;
  if (token) {
    jwt.verify(token, de_cert, (err, decoded) => {
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

let checkLogin2 = (req, res, next) => {
  let token = req.cookies.loginToken;
  if (token) {
    jwt.verify(token, de_cert, (err, decoded) => {
      if (err) {
        next();
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    next();
  }
};

let checkToken = (req, res, next) => {
  let token = req.cookies.loginToken;
  if (token) {
    jwt.verify(token, de_cert, (err, decoded) => {
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
    jwt.verify(token, de_cert, (err, decoded) => {
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
  checkLogin2: checkLogin2,
  checkToken: checkToken,
  checkPrivilege: checkPrivilege
}