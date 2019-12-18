$(document).ready(function(){
  $('#login-submit').click(function(){
    login();
  });
});

function login() {
  let privilege = 0;
  $("input[name='usertype[]']").each(function (index, obj) {
    if(obj.checked){
      privilege = index;
    }
  });
  (async () => {
    let username = $('#username').val();
    let password = $('#password').val();
    let data = {username: username, password: password, privilege: privilege};
    let result = await loginAjax(data);
    if(result) {
      Cookies.set('loginToken', result);
      window.location.replace('/user-dashboard');
    }else{
      alert('帳號或密碼錯誤。');
    }
  })()
}

async function loginAjax(data) {
  let result;
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

function forgetPw() {
  window.open('http://210.61.46.35/newPass');
}

function register() {
  window.open('http://210.61.46.35/register');
}


