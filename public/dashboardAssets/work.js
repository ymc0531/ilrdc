$(document).ready(function() {
  initDialect();
  initUserInfo();
  initUsers();
  //test();
})

pageSetting();

function test() {
  $('#system-page').css('display', 'none');
  $('#users-page').css('display', 'block');
}

function pageSetting() {
  (async () => {
    let result = await getPrivilegeAjax();
    switch(result[0].privilege) {
      case 2:
        $('#sb_users-page').css('display', 'none');
        $('#users-page').html('');
        break;
      case 1:
        $('#sb_upload-page').css('display', 'none');
        $('#sb_users-page').css('display', 'none');
        $('#upload-page').html('');
        $('#users-page').html('');
        break;
    }
  })()
}

async function getPrivilegeAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/privilege',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getDialectAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/dialect',
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

function initDialect() {
  (async () => {
    let result = await getDialectAjax();
    for(let i=0;i<result.length;i++){
      $('#dialect').append(`
        <option>${result[i].language}</option>
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
    $('#birthdate').val(result[0].birthdate);
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
  let dialect = $('#dialect').val();
  let tribe = $('#tribe').val();
  let mobile_no = $('#mobile_no').val();
  let office_no = $('#office_no').val();
  let postcode = $('#postcode').val();
  let address = $('#address').val();
  let data = {id: id, username: username, email: email, birthdate: birthdate, identity_num: identity_num, gender: gender, name_zh: name_zh, name_ind: name_ind, dialect: dialect, tribe: tribe, mobile_no: mobile_no, office_no: office_no, postcode: postcode, address: address};
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

function initUsers() {
  let status;
  let type = $('#acc_type').val();
  let page = $('#page1').val();
  if(!page) page = 1;
  let data = {page: page, type: type};
  (async () => {
    let result = await getUsersAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/15);

    $('#page1').html('');
    for(let i=1;i<=tpage;i++){
      $('#page1').append(`<option>${i}</option>`);
    }
    $('#page1').val(page);

    $('#workTable').html('');    
    for(let i=0;i<result[1].length;i++){
      status = '';
      if(result[1][i].status==1) {
        status = 'checked';
      }
      $('#workTable').append(`
        <tr>
          <td style="width: 10%">
            <p class="nm">${i+1}</p>
          </td>
          <td style="width: 20%">
            <p class="nm">${result[1][i].username}</p>
          </td>
          <td style="width: 20%">
            <p class="nm">${result[1][i].identity_num}</p>
          </td>
          <td style="width: 20%">
            <p class="nm">${result[1][i].name_zh}</p>
          </td>
          <td style="width: 20%">
            <p class="nm">${result[1][i].name_ind}</p>
          </td>
          <td style="width: 10%">
            <input type="checkbox" onclick="changeStatus(this, ${result[1][i].id})" ${status} class="nm-1">
          </td>
        </tr>
      `);
    }
  })()
}

async function getUsersAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/users',
      type: 'POST',
      data: data,
      statusCode: {
        403: function() {
          console.log('無權限');
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function changeType() {
  $('#page1').val('1');
  initUsers();
}

function changeStatus(val, id) {
  let status = $(val).prop('checked');
  status == true ? status = 1: status = 0;
  let data = {id: id, status: status};
  (async () => {
    await changeStatusAjax(data);
    initUsers();
  })()
}

async function changeStatusAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/status',
      type: 'PUT',
      data: data,
      statusCode: {
        403: function() {
          console.log('無權限');
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
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

function uploadPage () {
  let currpage = $('.content').attr('data-current-page');
  $(`#${currpage}`).css('display', 'none');
  $('.content').attr('data-current-page', 'upload-page');
  $('.navbar-brand').html('資料上傳');
  $('#upload-page').css('display', 'block');
};

function usersPage () {
  let currpage = $('.content').attr('data-current-page');
  $(`#${currpage}`).css('display', 'none');
  $('.content').attr('data-current-page', 'users-page');
  $('.navbar-brand').html('帳戶資訊');
  $('#users-page').css('display', 'block');
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

function changeFile() {
  let filename = $('#file').val();
  filename = filename.substr(12, filename.length);
  $('.ins-btn').val(filename);
}

function chooseFile() {
  document.getElementById('file').click();
}

function changeFile1() {
  let filename = $('#file_1').val();
  filename = filename.substr(12, filename.length);
  $('.ins-btn-1').val(filename);
}

function chooseFile1() {
  document.getElementById('file_1').click();
}

function uploadToDb() {
  $('#csv_data').submit();  
}

function uploadToDb1() {
  $('#csv_data_1').submit();  
}

$('#csv_data').submit(function(e) {
  let url;
  let system = $('#system').val();
  switch(system) {
    case '1':
      url = '/uploadTow';
      break;
    case '2':
      url = '/uploadNw';
      break;
    case '3':
      url = '/uploadAr';
      break;
  }
  $.ajax({
    url: url,
    type: "POST",
    data: new FormData(this),
    processData: false,
    contentType: false,
    statusCode: {
      200: function() {
        alert( "上傳成功" );
      },
      400: function() {
        alert( "上傳失敗" );
      }
    }
  });

  return false;
})

$('#csv_data_1').submit(function(e) {
  $.ajax({
    url: '/usersUpload',
    type: "POST",
    data: new FormData(this),
    processData: false,
    contentType: false,
    statusCode: {
      200: function() {
        initUsers();
        alert( "上傳成功" );
      },
      400: function() {
        alert( "上傳失敗" );
      },
      403: function() {
        alert( "無權限" );
      }
    }
  });

  return false;
})

function changepage(num) {
  switch(num) {
    case 1:
      initUsers();
      break;
  }
}

function prevpage(num) {
  let currpage = parseInt($(`#pages-${num}`).val(), 10);
  if(currpage>1){
    $(`#pages-${num}`).val(currpage-1);
    switch(num){
      case 1:
        initUsers();
        break;
    }
  }
}
function nextpage(num) {
  let currpage = parseInt($(`#page${num}`).val(), 10);
  let maxpage = $(`#page${num}`).children().length;
  if(currpage < maxpage){
    $(`#page${num}`).val(currpage+1);
    switch(num){
      case 1:
        initUsers();
        break;
    }
  }
}

function createUser() {
  let type = $('#n_type').val();
  let username = $('#n_username').val();
  let password = $('#n_password').val();
  let data = {type: type, username: username, password: password};
  if(!username||!password||username==''||password=='') {
    alert('帳號密碼必填。');
  }else{
    (async () => {
      await createUserAjax(data);
    })()
  }
}

async function createUserAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/user',
      type: 'PUT',
      data: data,
      statusCode: {
        200: function() {
          initUsers();
          alert('新增成功');
        },
        400: function() {
          alert('資料錯誤');
        },
        403: function() {
          alert('無權限');
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}



