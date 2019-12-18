$(document).ready(function() {
  initLanguage();
  initUserInfo();
  //test();
})

function test() {
  $('#system-page').css('display', 'none');
  $('#profile-page').css('display', 'block');
}

async function getLanguageAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/language',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getUserInfoAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/user-info',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateUserInfoAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/user-info',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updatePasswordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/password',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initLanguage() {
  (async () => {
    let result = await getLanguageAjax();
    for(let i=0;i<result[0].length;i++){
      $('#ethnicity').append(`
        <option value='${result[0][i].id}'>${result[0][i].ethnicity}</option>
      `);
    }
    for(let i=0;i<result[1].length;i++){
      $('#dialect').append(`
        <option value='${result[1][i].id}'>${result[1][i].dialect_zh}</option>
      `);
    }
    for(let i=0;i<result[2].length;i++){
      $('#tribe').append(`
        <option value='${result[2][i].id}'>${result[2][i].tribe_zh}</option>
      `);
    }
  })()
}

function initUserInfo() {
  (async () => {
    let result = await getUserInfoAjax();
    $('#username').attr('data-id', result[0].id);
    $('#username').val(result[0].username);
    $('#email').val(result[0].email);
    $('#birthdate').val(result[0].birthdate.substr(0,10));
    $('#identity_num').val(result[0].identity_num);
    $('#gender').val(result[0].gender);
    $('#name_zh').val(result[0].name_zh);
    $('#name_ind').val(result[0].name_ind);
    $('#dialect').val(result[0].ind_dialect);
    $('#tribe').val(result[0].tribe);
    $('#mobile_no').val(result[0].mobile_no);
    $('#office_no').val(result[0].office_no);
    $('#postcode').val(result[0].current_postcode);
    $('#address').val(result[0].current_addr);
  })()
}

function updateInfo() {
  let id = $('#username').attr('data-id');
  let username = $('#username').val();
  let email = $('#email').val();
  let birthdate = $('#birthdate').val();
  let identity_num = $('#identity_num').val();
  let gender = $('#gender').val();
  let name_zh = $('#name_zh').val();
  let name_ind = $('#name_ind').val();
  let ethnicity = $('#ethnicity').val();
  let dialect = $('#dialect').val();
  let tribe = $('#tribe').val();
  let mobile_no = $('#mobile_no').val();
  let office_no = $('#office_no').val();
  let postcode = $('#postcode').val();
  let address = $('#address').val();
  let data = {id: id, username: username, email: email, birthdate: birthdate, identity_num: identity_num, gender: gender, name_zh: name_zh, name_ind: name_ind, ethnicity: ethnicity, dialect: dialect, tribe: tribe, mobile_no: mobile_no, office_no: office_no, postcode: postcode, address: address};
  (async () => {
    let result = await updateUserInfoAjax(data);
    closeModal('confirmModal');
    alert('資料已更新。');
    initUserInfo();
  })()
}

function updatePassword() {
  let old_pw = $('#old_pw').val();
  let new_pw = $('#new_pw').val();
  let cfm_new_pw = $('#cfm_new_pw').val();
  let data = {old_pw: old_pw, new_pw: new_pw};
  if(new_pw!=cfm_new_pw) {
    alert('新密碼與確認新密碼不相同。');
    closeModal('confirmModal1');
  }else if(old_pw==new_pw){
    alert('舊密碼和新密碼相同。');
    closeModal('confirmModal1');
  }else{
    (async () => {
      let result = await updatePasswordAjax(data);
      if(result.changedRows==0) alert('舊密碼不正確。');
      else {
        $('#old_pw').val('');
        $('#new_pw').val('');
        $('#cfm_new_pw').val('');
        alert('密碼已更新。');
      }
      closeModal('confirmModal1');
    })()
  }
}

function showModal(modal) {
  $(`#${modal}`).css('display', 'flex');
}

function closeModal(modal) {
  $(`#${modal}`).css('display', 'none');
}

function systemPage () {
  let currpage = $('.content').attr('data-current-page');
  $(`#${currpage}`).css('display', 'none');
  $('.content').attr('data-current-page', 'system-page');
  $('.navbar-brand').html('資訊系統');
  $('#system-page').css('display', 'block');
};

function websitePage () {
  let currpage = $('.content').attr('data-current-page');
  $(`#${currpage}`).css('display', 'none');
  $('.content').attr('data-current-page', 'website-page');
  $('.navbar-brand').html('資訊網站');
  $('#website-page').css('display', 'block');
};

function profilePage () {
  let currpage = $('.content').attr('data-current-page');
  $(`#${currpage}`).css('display', 'none');
  $('.content').attr('data-current-page', 'profile-page');
  $('.navbar-brand').html('個人資料');
  $('#profile-page').css('display', 'block');
};

function newWord () {
  window.open("/newWord");
};

function newSentence () {
  window.open("/newSentence");
};

function dailt () {
  window.open("http://dailt.ilrdc.tw");
};

function logout () {
  Cookies.remove('loginToken');
  window.location.href="/";
}