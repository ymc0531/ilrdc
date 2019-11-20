$(document).ready(function(){
  $('#login-submit').click(function(){
    login();
  });
});

function login() {
  (async () => {
    let username = $('#username').val();
    let password = $('#password').val();
    let result = await loginAjax(username, password);
    if(result) {
      Cookies.set('loginToken', result);
    }
  })()
}

async function loginAjax(username, password) {
  let result;
  let data = {username: username, password: password};
  try {
    result = await $.ajax({
      url: '/login',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

$("#username").keypress(function(e) {
    if(e.keyCode == 13) {
      login();  
    }
});

$("#password").keypress(function(e) {
    if(e.keyCode == 13) {
      login();
    }
});