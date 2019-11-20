var express = require('express');
var router = express.Router();

var Request = require("request-promise");

function verify(type){
  return async function(req,res,next){
    try{
      let token = req.cookies.user.token;
      await checkToken(token)
      .then(function (result) {
        res.locals.username = result;
        res.cookie("username", {"username":result});
        next()
      })
    }catch (error) {
      res.clearCookie('user');
      res.clearCookie('username');
      if(type === 'manage'){
        res.render('manage/login');
      }
    }
  }
}

async function checkToken(token){
  try{
    let url = 'http://localhost/api/users/auth'
    let option = {
      method: 'post',
      json: true,
      url: url,
      headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'Authorization' : token
      }
    }
    return Request(option)
  }catch(error){
    return error
  }
}
module.exports = {
  verify: verify
}
