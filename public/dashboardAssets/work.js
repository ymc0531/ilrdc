$(document).ready(function() {
  initDialect();
  initUserInfo();
  initUsers();
  initSetting();
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
        $('#sb_nw-setting-page').css('display', 'none');
        $('#sb_upload-page').css('display', 'none');
        $('#sb_users-page').css('display', 'none');
        $('#nw-setting-page').html('');
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

function initSetting() {
  (async () => {
    let result = await getSettingAjax();
    $('#fey').val(result[0].first_edition_year);
    $('#fey_1').val(result[0].fey_title_row_1);
    $('#fey_2').val(result[0].fey_title_row_2);
    $('#lcy').val(result[0].latest_checked_year);
    $('#lcy_1').val(result[0].lcy_title_row_1);
    $('#lcy_2').val(result[0].lcy_title_row_2);
    $('#pyf').val(result[0].past_year_from);
    $('#pyf_1').val(result[0].py_title_row_1);
    $('#pyf_2').val(result[0].py_title_row_2);
  })()
}

async function getSettingAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/nw_setting',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function renewSetting() {
  let fey = $('#fey').val();
  let fey_1 = $('#fey_1').val();
  let fey_2 = $('#fey_2').val();
  let lcy = $('#lcy').val();
  let lcy_1 = $('#lcy_1').val();
  let lcy_2 = $('#lcy_2').val();
  let pyf = $('#pyf').val();
  let pyf_1 = $('#pyf_1').val();
  let pyf_2 = $('#pyf_2').val();
  let data = {fey: fey, fey_1: fey_1, fey_2: fey_2, lcy: lcy, lcy_1: lcy_1, lcy_2: lcy_2, pyf: pyf, pyf_1: pyf_1, pyf_2: pyf_2};
  (async () => {
    await renewSettingAjax(data);
  })()
}

async function renewSettingAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/nw_setting',
      type: 'PUT',
      data: data,
      statusCode: {
        200: function() {
          initSetting();
          alert('更改成功');
        },
        400: function() {
          alert('更改失敗');
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
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

function nwSettingPage () {
  let currpage = $('.content').attr('data-current-page');
  $(`#${currpage}`).css('display', 'none');
  $('.content').attr('data-current-page', 'nw-setting-page');
  $('.navbar-brand').html('新詞設定');
  $('#nw-setting-page').css('display', 'block');
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

function towCsv() {
  //let result = [{sid: '編號', dialect: '方言', cate: '分類', snum: 'snum', ftws: '族語詞彙', ctws: '中文詞彙', fexam: '族語例句', cexam: '中文例句', LanLevelE: '初級', LanLevelM: '中級', LanLevelMH: '中高級', LanLevelH: '高級', memo: '備註'}, {sid: '18-010040000', dialect: '南勢阿美', cate: '生活用語', snum: '01-00', ftws: 'test', ctws: '測試', fexam: 'test example', cexam: '測試例句', LanLevelE: '0', LanLevelM: '1', LanLevelMH: '0', LanLevelH: '0', memo: ''}];
  //JSONToCSVConvertor(result, '詞表', false);
  window.open('https://drive.google.com/file/d/1WbHwhC9Dwy-ko7HAb8l2ninR5dh61EM_/view?usp=sharing');

}

function nwCsv() {
  window.open('https://drive.google.com/open?id=1b_R_567eSna7JRyalf39k73PmR2VYVXd');
}

function arCsv() {
  //let result = [{season: '108', language: '阿美', dialect: '南勢阿美', cate: '生活用語', subcate: '數字計量', ch: '我們', ab: 'kita', mean: '我們的意思', description: '我們', word_formation: '構詞法', ch_example: '中文例句', ab_example: '族語例句', example_type: '句型', remark: '備註'}, {season: '年度', language: '語言', dialect: '方言', cate: '主分類', subcate: '次分類', ch: '中文詞彙', ab: '族語詞彙', mean: '語意', description: '創詞說明', word_formation: '重疊', ch_example: '我們一起', ab_example: 'kita semua', example_type: '祈使句', remark: ''}];
  //JSONToCSVConvertor(result, '新詞', false);
  window.open('https://drive.google.com/open?id=1lKnt6rA4Ni-Fur4gt7jijKC1a0az_tkx');
}

function usrCsv() {
  window.open('https://drive.google.com/open?id=19Ax-uqflY4Jl_9SQHrFgJG4YwuRvMrrv');
}



function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
  var CSV = '';    

  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";
    
    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      
      //Now convert each value to string and comma-seprated
      row += index + ',';
    }

    row = row.slice(0, -1);
    
    //append Label row with line break
    CSV += row + '\r\n';
  }
  
  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = "";
    
    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    row.slice(0, row.length - 1);
    
    //add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV == '') {        
    alert("Invalid data");
    return;
  }   
  
  //Generate a file name
  var fileName = "";
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g,"_");   
  
  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV);
  
  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension    
  
  //this trick will generate a temp <a /> tag
  var link = document.createElement("a");    
  link.href = uri;
  
  //set the visibility hidden so it will not effect on your web-layout
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  
  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


