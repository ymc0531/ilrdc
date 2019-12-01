$(document).ready(function(){
  $('#btn2').css('background-color', '#ACACAC');
  $('#2').css('display', 'block');
  $('#a-o-family').val('阿美');
  
  sidebarToggle();
  initLanguage();
  initCategory();
  initOperator();
  initSuggest();
  initWords();
  initAddOperatorFamily();
  initAddOperatorDialect();

  $('#searchBtn4').click(function(){
    $('#page4').val('1');
    initWords();
  });

  $('#searchBtn7').click(function(){
    $('#page7').val('1');
    initSuggest();
  });

  $('.confirm-btn').click(function(){
    $('#confirmModal').css('display', 'block');
  });
})

function initAddOperatorFamily() {
  (async () => {
    let tmp;
    let result = await getFamilyAjax();

    for(let i=0;i<result.length;i++){
      if(i==0) tmp = `<option value='${result[i].family}'>${result[i].family}</option>`
      $('#a-o-family').append(`
        <option value='${result[i].family}'>${result[i].family}</option>
      `);
    }
  })()
}

function initAddOperatorDialect() {
  let data = {family: $('#a-o-family').val()};
  
  (async () => {
    let result = await getDialectAjax(data);

    $('#a-o-dialect').html('');
    for(let i=0;i<result.length;i++){
      $('#a-o-dialect').append(`
        <option value='${result[i].language}'>${result[i].language}</option>
      `);
    }
  })()
}

function initLanguage() {
  (async () => {
    let result = await getLanguageAjax();
    let tmp4, tmp7;

    for(let i=1;i<=7;i++){
      tmp4 = '';
      tmp4 += `<div class='select-item'>`;
      tmp7 = '';
      tmp7 += `<div class='select-item'>`;

      for(let j=0;j<result.length;j++){
        if(result[j].family_id==i){
          tmp4 += `<input type="checkbox" name="language4[]" value="${result[j].language}" checked>${result[j].language}&nbsp;`
          tmp7 += `<input type="checkbox" name="language7[]" value="${result[j].language}" checked>${result[j].language}&nbsp;`
        }
      }
      tmp4 += `</div>`;
      tmp7 += `</div>`;
      $('#lang4').append(tmp4);
      $('#lang7').append(tmp7);
    }

    tmp4 = '';
    tmp4 += `<div class='select-item'>`;
    tmp7 = '';
    tmp7 += `<div class='select-item'>`;
    for(let i=8;i<=16;i++){
      for(let j=0;j<result.length;j++){
        if(result[j].family_id==i){
          tmp4 += `<input type="checkbox" name="language4[]" value="${result[j].language}" checked>${result[j].language}&nbsp;`
          tmp7 += `<input type="checkbox" name="language7[]" value="${result[j].language}" checked>${result[j].language}&nbsp;`
        }
      }
    }
    tmp4 += `</div>`;
    tmp7 += `</div>`;
    $('#lang4').append(tmp4);
    $('#lang7').append(tmp7);

  })()
}

function initCategory() {
  (async () => {
    let result = await getCategoryAjax();
    let tmp4, tmp7;

    for(let i=0;i<6;i++){
      tmp4 = '';
      tmp4 += `<div class='select-item'>`
      tmp7 = '';
      tmp7 += `<div class='select-item'>`
      for(let j=i*6;j<(i+1)*6;j++){
        tmp4 += `<input type="checkbox" name="category4[]" value="${result[j].cate}" checked>${result[j].cate}&nbsp;`;
        tmp7 += `<input type="checkbox" name="category7[]" value="${result[j].cate}" checked>${result[j].cate}&nbsp;`;
      }
      tmp4 += `</div>`;
      tmp7 += `</div>`;
      $('#cate4').append(tmp4);
      $('#cate7').append(tmp7);
    }
  })()
}

function initOperator() {
  (async () => {
    let result = await getOperatorAjax();
    let status;

    $('#workTable').html('');    
    for(let i=0;i<result.length;i++){
      if(result[i].status==100){
        status = `<p class="nm done">已完成</p>`
      }else{
        status = `<p class="nm undone">未完成 ${result[i].status}%</p>`
      }
      $('#workTable').append(`
        <tr>
          <td style="width: 5%">
            <p class="nm">${i+1}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[i].family}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[i].dialect}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[i].username}</p>
          </td>
          <td style="width: 15%">
            ${status}
          </td>
          <td style="width: 15%">
            <p class="nm clickable" onclick="goPlatform()">${result[i].dialect}詞表平台</p>
          </td>
          <td style="width: 25%">
            <p class="nm">${result[i].last_edit}</p>
          </td>
          <td style="width: 10%">
            <p class="nm clickable" onclick="applyOperator('${result[i].id}')">編輯</p>
          </td>
        </tr>
      `);
    }
  })()
}

async function getFamilyAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/getFamily',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getDialectAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/dialect',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getLanguageAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/getLanguage',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getCategoryAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/getCategory',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/operator',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getSuggestAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/suggest',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function suggestDownloadAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/suggestDownload',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteSuggestAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/suggest',
      type: 'DELETE',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteWordsAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/words',
      type: 'DELETE',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getWordsAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/getWords',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/operator',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function putFeedbackAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/feedback',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initSuggest() {
  let result;
  let lang = document.getElementsByName('language7[]');
  let cate = document.getElementsByName('category7[]');
  let level = document.getElementsByName('level7[]');
  let langList=[];
  let cateList=[];
  let levelList=[];
  let check=[];
  let data, limit, bgColor;

  $('#sEdit').prop('checked', false);
  $('.sTable-td-edit').css('display', 'none');

  for(let i=0;i<level.length;i++){
    if(level[i].checked){
      levelList.push(level[i].value);
    }
  }
  waitForEl(lang, function() {
    for(let i=0;i<lang.length;i++){
      if(lang[i].checked){
        langList.push(lang[i].value);
      }
    }
  });
  waitForEl(cate, function() {
    for(let i=0;i<cate.length;i++){
      if(cate[i].checked){
        cateList.push(cate[i].value);
      }
    }
  });
  waitForAll(lang, cate, function() {
    let currpage = $('#page7').val();
    if(!currpage) currpage = 1;
    let rowPerPage = $('#rowPerPage7').val();
    let keyword = $('#keyword7').val();
    data = {lang: JSON.stringify(langList), cate: JSON.stringify(cateList), keyword: keyword, level: JSON.stringify(levelList), currpage: currpage, rowPerPage: rowPerPage};
    (async () => {
      result = await getSuggestAjax(data);
      let page = Math.ceil(parseInt(result[0][0]['COUNT(*)'], 10)/rowPerPage);
      
      $('#7 #sTitle-p').html('');
      $('#7 #sTitle-p').append(`檢視結果共&nbsp;<a style="color: red;">${result[0][0]['COUNT(*)']}</a>&nbsp;筆資料`);

      $('#page7').html('');
      for(var i=1;i<=page;i++){
        $('#page7').append(`
          <option value="${i}">${i}</option>
        `);
      }
      if(currpage) $('#page7').val(currpage);

      $('#sTable').html('');
      for(let i=0;i<result[1].length;i++){
        if(i%2==0) bgColor = `'white'`;
        else bgColor = `#E1E0E0`;
        $('#sTable').append(`
          <tr style="background-color: ${bgColor}">
            <td class="sTable-td-edit" style="width: 7.5%;">
              <a class="confirm-btn" onclick="showConfirmModal7('${result[1][i].tsid}', this)">確認</a>&nbsp;/
              <a class="delete-btn" onclick="showDeleteModal7('${result[1][i].tsid}')">刪除</a>
            </td>
            <td style="width: 5%">
              <p class="nm">${i+1}</p>
            </td>
            <td style="width: 5%">
              <p class="nm">${result[1][i].family}</p>
            </td>
            <td style="width: 7.5%">
              <p class="nm">${result[1][i].dialect}</p>
            </td>
            <td style="width: 7.5%">
              <p class="nm">${result[1][i].category}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].sid}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].ftws}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].ctws}</p>
            </td>
            <td style="width: 10%">
              <p class="nm ta-left">${result[1][i].fexam}</p>
            </td>
            <td style="width: 10%">
              <p class="nm ta-left">${result[1][i].cexam}</p>
            </td>
            <td style="width: 5%">
              <p class="nm">?</p>
            </td>
            <td style="width: 10%">
              <p class="nm ta-left">${result[1][i].suggestion}</p>
            </td>
            <td class="feedback">
              <textarea rows="4">${result[1][i].admin_feedback}</textarea>
            </td>
          </tr>
        `);
      }
    })()
  });
}

function initWords() {
  let result;
  let lang = document.getElementsByName('language4[]');
  let cate = document.getElementsByName('category4[]');
  let level = document.getElementsByName('level4[]');
  let langList=[];
  let cateList=[];
  let levelList=[];
  let check=[];
  let data, limit, bgColor;

  $('#sEdit').prop('checked', false);
  $('.sTable-td-edit').css('display', 'none');

  for(let i=0;i<level.length;i++){
    if(level[i].checked){
      levelList.push(level[i].value);
    }
  }
  waitForEl(lang, function() {
    for(let i=0;i<lang.length;i++){
      if(lang[i].checked){
        langList.push(lang[i].value);
      }
    }
  });
  waitForEl(cate, function() {
    for(let i=0;i<cate.length;i++){
      if(cate[i].checked){
        cateList.push(cate[i].value);
      }
    }
  });
  waitForAll(lang, cate, function() {
    let currpage = $('#page4').val();
    if(!currpage) currpage = 1;
    let rowPerPage = $('#rowPerPage4').val();
    let keyword = $('#keyword4').val();
    data = {lang: JSON.stringify(langList), cate: JSON.stringify(cateList), keyword: keyword, level: JSON.stringify(levelList), currpage: currpage, rowPerPage: rowPerPage};
    (async () => {
      result = await getWordsAjax(data);
      
      let page = Math.ceil(parseInt(result[0][0]['COUNT(*)'], 10)/rowPerPage);
      $('#page4').html('');
      
      $('#4 #sTitle-p').html('');  
      $('#4 #sTitle-p').append(`檢視結果共&nbsp;<a style="color: red;">${result[0][0]['COUNT(*)']}</a>&nbsp;筆資料`);

      for(var i=1;i<=page;i++){
        $('#page4').append(`
          <option value="${i}">${i}</option>
        `);
      }
      if(currpage) $('#page4').val(currpage);

      $('#wTable').html('');
      for(let i=0;i<result[1].length;i++){
        if(i%2==0) bgColor = `'white'`;
        else bgColor = `#E1E0E0`;
        $('#wTable').append(`
          <tr style="background-color: ${bgColor}">
            <td class="sTable-td-edit" style="width: 7.5%;">
              <a class="confirm-btn" onclick="showConfirmModal4('${result[1][i].id}', this)">確認</a>&nbsp;/
              <a class="delete-btn" onclick="showDeleteModal4('${result[1][i].id}')">刪除</a>
            </td>
            <td style="width: 5%">
              <p class="nm">${i+1}</p>
            </td>
            <td style="width: 5%">
              <p class="nm">${result[1][i].family}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].dialect}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].category}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].sid}</p>
            </td>
            <td style="width: 10%">
              <p class="nm">${result[1][i].ftws}</p>
            </td>
            <td style="width: 10%">
              <p class="nm">${result[1][i].ctws}</p>
            </td>
            <td style="width: 15%">
              <p class="nm ta-left">${result[1][i].fexam}</p>
            </td>
            <td style="width: 15%">
              <p class="nm ta-left">${result[1][i].cexam}</p>
            </td>
            <td style="width: 5%">
              <p class="nm">?</p>
            </td>
            <td>
              <p class="nm ta-left">${result[1][i].memo}</p>
            </td>
          </tr>
        `);
      }
    })()
  });
}

function addOppConfirm() {
  if($('#a-o-dialect').val()) {
    let data = {family: $('#a-o-family').val(), dialect: $('#a-o-dialect').val()};
    (async () => {
      await addOperatorAjax(data);
      $('#addOperatorModal').css('display', 'none');
      initOperator();
    })()
  }
}

function addOppCancel() {
  $('#addOperatorModal').css('display', 'none');
}

function sidebarToggle() {
  let display = $('#sidebar').css('display');
  if(display=="none"){
    $('#content').css('width', '84%');
    $('#sidebar').css('display', 'block');
  }else{
    $('#sidebar').css('display', 'none');
    $('#content').css('width', '100%');
  }
}

function show(id) {
  let currentBtn = $('#sidebar').attr('data-current-btn');
  let currentContent = $('#content').attr('data-current-content');

  $(`#${currentContent}`).css('display', 'none');
  $('#content').attr('data-current-content', id);
  $(`#btn${id}`).css('background-color', '#ACACAC');
  $(`#${currentBtn}`).css('background-color', '#D6D6D6');
  $('#sidebar').attr('data-current-btn', `btn${id}`);

  switch(id) {
    case '1':
      $('#1').css('display', 'block');
      break;
    case '2':
      $('#2').css('display', 'block');
      break;
    case '3':
      $('#3').css('display', 'block');
      break;
    case '4':
      $('#4').css('display', 'block');
      break;
    case '5':
      $('#5').css('display', 'block');
      break;
    case '6':
      $('#6').css('display', 'block');
      break;
    case '7':
      $('#7').css('display', 'block');
      break;
  }
}

function show4(cmd) {
  switch(cmd) {
    case 'lang':
      $('#cate4').css('display', 'none');
      $('#level4').css('display', 'none');
      if($('#lang4').css('display')=='none'){
        $('#lang4').css('display', 'block');
      }else{
        $('#lang4').css('display', 'none');
      }
      break;
    case 'cate':
      $('#level4').css('display', 'none');
      $('#lang4').css('display', 'none');
      if($('#cate4').css('display')=='none'){
        $('#cate4').css('display', 'block');
      }else{
        $('#cate4').css('display', 'none');
      }
      break;
    case 'level':
      $('#cate4').css('display', 'none');
      $('#lang4').css('display', 'none');
      if($('#level4').css('display')=='none'){
        $('#level4').css('display', 'block');
      }else{
        $('#level4').css('display', 'none');
      }
      break;
  }
}

function show7(cmd) {
  switch(cmd) {
    case 'lang':
      $('#cate7').css('display', 'none');
      $('#level7').css('display', 'none');
      if($('#lang7').css('display')=='none'){
        $('#lang7').css('display', 'block');
      }else{
        $('#lang7').css('display', 'none');
      }
      break;
    case 'cate':
      $('#level7').css('display', 'none');
      $('#lang7').css('display', 'none');
      if($('#cate7').css('display')=='none'){
        $('#cate7').css('display', 'block');
      }else{
        $('#cate7').css('display', 'none');
      }
      break;
    case 'level':
      $('#cate7').css('display', 'none');
      $('#lang7').css('display', 'none');
      if($('#level7').css('display')=='none'){
        $('#level7').css('display', 'block');
      }else{
        $('#level7').css('display', 'none');
      }
      break;
  }
}

function langAP(num) {
  let all = document.getElementsByName(`language${num}[]`);
  let check = $(`#langAP${num}`).prop('checked');
  if(check){
    for(let i=0;i<all.length;i++){
      all[i].checked = true;
    }
  }else{
    for(let i=0;i<all.length;i++){
      all[i].checked = false;
    }
  }
}

function cateAP(num) {
  let all = document.getElementsByName(`category${num}[]`);
  let check = $(`#cateAP${num}`).prop('checked');
  if(check){
    for(let i=0;i<all.length;i++){
      all[i].checked = true;
    }
  }else{
    for(let i=0;i<all.length;i++){
      all[i].checked = false;
    }
  }
}

function levelAP(num) {
  let all = document.getElementsByName(`level${num}[]`);
  let check = $(`#levelAP${num}`).prop('checked');
  if(check){
    for(let i=0;i<all.length;i++){
      all[i].checked = true;
    }
  }else{
    for(let i=0;i<all.length;i++){
      all[i].checked = false;
    }
  }
}

var waitForEl = function(selector, callback) {
  if (jQuery(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

var waitForAll = function(lang, cate, callback) {
  if (jQuery(lang).length&&jQuery(cate).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForAll(lang, cate, callback);
    }, 100);
  }
};

function showConfirmModal7(id, val) {
  let fb = $(val).parent().parent().find('.feedback').children('textarea').val();
  if(fb==''){
    alert('請填好資料再送出。')
  }else{
    $('#confirmModal').attr('data-id', id);
    $('#confirmModal').attr('data-fb', fb);
    $('#confirmModal').css('display', 'block');
  }
}

function showDeleteModal4(id) {
  $('#deleteModal').attr('data-id', id);
  $('#deleteModal').attr('data-mode', '4');
  $('#deleteModal').css('display', 'block');
}

function showDeleteModal7(id) {
  $('#deleteModal').attr('data-id', id);
  $('#deleteModal').attr('data-mode', '7');
  $('#deleteModal').css('display', 'block');
}

function suggestSubmit() {
  (async () => {
    let id = $('#confirmModal').attr('data-id');
    let fb = $('#confirmModal').attr('data-fb');
    let data = {id: id, fb: fb};
    let result = await putFeedbackAjax(data);
    $('#confirmModal').css('display', 'none');
    initSuggest();
  })()
}

function suggestCancel() {
  $('#confirmModal').css('display', 'none');
}

function deleteConfirm() {
  (async () => {
    let id = $('#deleteModal').attr('data-id');
    let mode = $('#deleteModal').attr('data-mode');
    let data = {id: id};
    let result;
    switch(mode){
      case '4':
        result = await deleteWordsAjax(data);
        initWords();
        break;
      case '7':
        result = await deleteSuggestAjax(data);
        initSuggest();
        break;
    }
    $('#deleteModal').css('display', 'none');
  })()
}

function deleteCancel() {
  $('#deleteModal').css('display', 'none');
}

function changeRowPerPage(num) {
  $(`#page${num}`).val('1');
  switch(num){
    case 4:
      initWords();
      break;
    case 7:
      initSuggest();
      break;
  }
}

function changepage(num) {
  switch(num){
    case 4:
      initWords();
      break;
    case 7:
      initSuggest();
      break;
  }
}

function prevpage(num) {
  let currpage = parseInt($(`#page${num}`).val(), 10);
  if(currpage>1){
    $(`#page${num}`).val(currpage-1);
    switch(num){
      case 4:
        initWords();
        break;
      case 7:
        initSuggest();
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
      case 4:
        initWords();
        break;
      case 7:
        initSuggest();
        break;
    }
  }
}

function openEdit(num) {
  if($(`#${num}`).find('#sEdit').prop('checked')) {
    $(`#${num} .sTable-td-edit`).css('display', 'table-cell');
  }else{
    $(`#${num} .sTable-td-edit`).css('display', 'none');
  } 
}

function goPlatform() {
  window.open('http://tow.ilrdc.tw/login/login.php', '_blank');
}

function openAddOperator() {
  $('#addOperatorModal').css('display', 'block');
}

function closeAddOperator() {
  $('#addOperatorModal').css('display', 'none');
}

function applyOperator(id) {
  $('#applyOperatorModal').css('display', 'block');
}

function closeApplyOperator() {
  $('#applyOperatorModal').css('display', 'none');
}

function suggestDownload() {
  let result, tmpResult;
  let lang = document.getElementsByName('language7[]');
  let cate = document.getElementsByName('category7[]');
  let level = document.getElementsByName('level7[]');
  let langList=[];
  let cateList=[];
  let levelList=[];
  let check=[];
  let data, limit, bgColor;

  for(let i=0;i<level.length;i++){
    if(level[i].checked){
      levelList.push(level[i].value);
    }
  }
  waitForEl(lang, function() {
    for(let i=0;i<lang.length;i++){
      if(lang[i].checked){
        langList.push(lang[i].value);
      }
    }
  });
  waitForEl(cate, function() {
    for(let i=0;i<cate.length;i++){
      if(cate[i].checked){
        cateList.push(cate[i].value);
      }
    }
  });
  waitForAll(lang, cate, function() {
    data = {lang: JSON.stringify(langList), cate: JSON.stringify(cateList), level: JSON.stringify(levelList)};
    result = [{sid: '編號', family: '族語', dialect: '方言', category: '分類', ftws: '族語詞彙', ctws: '中文詞彙', fexam: '族語例句', cexam: '中文例句', suggestion: '意見回饋', admin_feedback: '處理情形'}];
    (async () => {
      tmpResult = await suggestDownloadAjax(data);
      for(let i=0;i<tmpResult.length;i++){
        result.push(tmpResult[i]);
      }
      JSONToCSVConvertor(result, '意見回饋', false);
    })()
  });
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
  var CSV = '';    
  //Set Report title in first row or line    
  CSV += ReportTitle + '\r\n\n';

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
  var fileName = "詞表_";
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

/*
function showCard(card) {
    document.getElementById(card).style.display = "block";
  }

  function delSubmit4(i) {
      $( `#delCont${i}` ).submit();
  }
  function delSubmit6(i) {
      $( `#delResh${i}` ).submit();
  }
  function delSubmit7(i) {
      $( `#delSug${i}` ).submit();
  }

  function fbSubmit(i) {
      $( `#adminFb${i}` ).submit();
  }

  function sidebarToggle() {
    var sidebar = document.getElementById("sidebar");
    var content = document.getElementById("content");
    var sbStyle = window.getComputedStyle(sidebar);
    var sbWidth = sbStyle.getPropertyValue('width');
    if(sbWidth!="0px"){
      $("#sidebar").animate({width: '0%'}, "fast");
      content.style.width = "90%";
    }else{
      $("#sidebar").animate({width: '20%'}, "fast");
      content.style.width = "70%";
    }
  }

  function confirmChecker4(i){
      document.getElementById(`confirmModal4${i}`).style.display = "block";
    };

    function cancelSubmit4(i){
      document.getElementById(`confirmModal4${i}`).style.display = "none";
    };

  function confirmChecker6(i){
      document.getElementById(`confirmModal6${i}`).style.display = "block";
    };

    function cancelSubmit6(i){
      document.getElementById(`confirmModal6${i}`).style.display = "none";
    };

  function confirmChecker7(i){
      document.getElementById(`confirmModal7${i}`).style.display = "block";
    };

    function cancelSubmit7(i){
      document.getElementById(`confirmModal7${i}`).style.display = "none";
    };

    function confirmCheckerE(i){
      document.getElementById(`confirmFbModal${i}`).style.display = "block";
    };

    function cancelSubmitE(i){
      document.getElementById(`confirmFbModal${i}`).style.display = "none";
    };

    function checkLangAP4() {
      var lang=document.getElementsByName("language4[]");
      var isAP = true;
      for(var i=0;i<lang.length;i++){
        if(lang[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("langAP4")[0].checked = isAP;
  }
  function checkCateAP4() {
      var cate=document.getElementsByName("category4[]");
      var isAP = true;
      for(var i=0;i<cate.length;i++){
        if(cate[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("cateAP4")[0].checked = isAP;
  }
  function checkLevelAP4() {
      var level=document.getElementsByName("level4[]");
      var isAP = true;
      for(var i=0;i<level.length;i++){
        if(level[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("levelAP4")[0].checked = isAP;
  }
  function flangAP4(){
    var ap=document.getElementsByName("langAP4")[0].checked;
    var lang=document.getElementsByName("language4[]");
    if(ap==true){
      for(var i=0;i<lang.length;i++){
        lang[i].checked = true;
      }
    }else{
      for(var i=0;i<lang.length;i++){
        lang[i].checked = false;
      }
    }
  }
  function fcateAP4(){
    var ap=document.getElementsByName("cateAP4")[0].checked;
    var cate=document.getElementsByName("category4[]");
    if(ap==true){
      for(var i=0;i<cate.length;i++){
        cate[i].checked = true;
      }
    }else{
      for(var i=0;i<cate.length;i++){
        cate[i].checked = false;
      }
    }
  }
  function flevelAP4(){
    var ap=document.getElementsByName("levelAP4")[0].checked;
    var level=document.getElementsByName("level4[]");
    if(ap==true){
      for(var i=0;i<level.length;i++){
        level[i].checked = true;
      }
    }else{
      for(var i=0;i<level.length;i++){
        level[i].checked = false;
      }
    }
  }
  function showLang4(){
    if(document.getElementById("lang4").style.display == "block"){
      document.getElementById("lang4").style.display = "none";
    }else{
      document.getElementById("lang4").style.display = "block";
      document.getElementById("cate4").style.display = "none";
      document.getElementById("level4").style.display = "none";
    }
  }
  function showCate4(){
    if(document.getElementById("cate4").style.display == "block"){
      document.getElementById("cate4").style.display = "none";
    }else{
      document.getElementById("lang4").style.display = "none";
      document.getElementById("cate4").style.display = "block";
      document.getElementById("level4").style.display = "none";
    }
  }
  function showLevel4(){
    if(document.getElementById("level4").style.display == "block"){
      document.getElementById("level4").style.display = "none";
    }else{
      document.getElementById("lang4").style.display = "none";
      document.getElementById("cate4").style.display = "none";
      document.getElementById("level4").style.display = "block";
    }
  }

  function checkLangAP5() {
      var lang=document.getElementsByName("language5[]");
      var isAP = true;
      for(var i=0;i<lang.length;i++){
        if(lang[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("langAP5")[0].checked = isAP;
  }
  function checkCateAP5() {
      var cate=document.getElementsByName("category5[]");
      var isAP = true;
      for(var i=0;i<cate.length;i++){
        if(cate[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("cateAP5")[0].checked = isAP;
  }
  function checkLevelAP5() {
      var level=document.getElementsByName("level5[]");
      var isAP = true;
      for(var i=0;i<level.length;i++){
        if(level[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("levelAP5")[0].checked = isAP;
  }
  function flangAP5(){
    var ap=document.getElementsByName("langAP5")[0].checked;
    var lang=document.getElementsByName("language5[]");
    if(ap==true){
      for(var i=0;i<lang.length;i++){
        lang[i].checked = true;
      }
    }else{
      for(var i=0;i<lang.length;i++){
        lang[i].checked = false;
      }
    }
  }
  function fcateAP5(){
    var ap=document.getElementsByName("cateAP5")[0].checked;
    var cate=document.getElementsByName("category5[]");
    if(ap==true){
      for(var i=0;i<cate.length;i++){
        cate[i].checked = true;
      }
    }else{
      for(var i=0;i<cate.length;i++){
        cate[i].checked = false;
      }
    }
  }
  function flevelAP5(){
    var ap=document.getElementsByName("levelAP5")[0].checked;
    var level=document.getElementsByName("level5[]");
    if(ap==true){
      for(var i=0;i<level.length;i++){
        level[i].checked = true;
      }
    }else{
      for(var i=0;i<level.length;i++){
        level[i].checked = false;
      }
    }
  }
  function showLang5(){
    if(document.getElementById("lang5").style.display == "block"){
      document.getElementById("lang5").style.display = "none";
    }else{
      document.getElementById("lang5").style.display = "block";
      document.getElementById("cate5").style.display = "none";
      document.getElementById("level5").style.display = "none";
    }
  }
  function showCate5(){
    if(document.getElementById("cate5").style.display == "block"){
      document.getElementById("cate5").style.display = "none";
    }else{
      document.getElementById("lang5").style.display = "none";
      document.getElementById("cate5").style.display = "block";
      document.getElementById("level5").style.display = "none";
    }
  }
  function showLevel5(){
    if(document.getElementById("level5").style.display == "block"){
      document.getElementById("level5").style.display = "none";
    }else{
      document.getElementById("lang5").style.display = "none";
      document.getElementById("cate5").style.display = "none";
      document.getElementById("level5").style.display = "block";
    }
  }

    function checkLangAP6() {
      var lang=document.getElementsByName("language6[]");
      var isAP = true;
      for(var i=0;i<lang.length;i++){
        if(lang[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("langAP6")[0].checked = isAP;
  }
  function checkCateAP6() {
      var cate=document.getElementsByName("category6[]");
      var isAP = true;
      for(var i=0;i<cate.length;i++){
        if(cate[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("cateAP6")[0].checked = isAP;
  }
  function checkLevelAP6() {
      var level=document.getElementsByName("level6[]");
      var isAP = true;
      for(var i=0;i<level.length;i++){
        if(level[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("levelAP6")[0].checked = isAP;
  }
  function flangAP6(){
    var ap=document.getElementsByName("langAP6")[0].checked;
    var lang=document.getElementsByName("language6[]");
    if(ap==true){
      for(var i=0;i<lang.length;i++){
        lang[i].checked = true;
      }
    }else{
      for(var i=0;i<lang.length;i++){
        lang[i].checked = false;
      }
    }
  }
  function fcateAP6(){
    var ap=document.getElementsByName("cateAP6")[0].checked;
    var cate=document.getElementsByName("category6[]");
    if(ap==true){
      for(var i=0;i<cate.length;i++){
        cate[i].checked = true;
      }
    }else{
      for(var i=0;i<cate.length;i++){
        cate[i].checked = false;
      }
    }
  }
  function flevelAP6(){
    var ap=document.getElementsByName("levelAP6")[0].checked;
    var level=document.getElementsByName("level6[]");
    if(ap==true){
      for(var i=0;i<level.length;i++){
        level[i].checked = true;
      }
    }else{
      for(var i=0;i<level.length;i++){
        level[i].checked = false;
      }
    }
  }
  function showLang6(){
    if(document.getElementById("lang6").style.display == "block"){
      document.getElementById("lang6").style.display = "none";
    }else{
      document.getElementById("lang6").style.display = "block";
      document.getElementById("cate6").style.display = "none";
      document.getElementById("level6").style.display = "none";
    }
  }
  function showCate6(){
    if(document.getElementById("cate6").style.display == "block"){
      document.getElementById("cate6").style.display = "none";
    }else{
      document.getElementById("lang6").style.display = "none";
      document.getElementById("cate6").style.display = "block";
      document.getElementById("level6").style.display = "none";
    }
  }
  function showLevel6(){
    if(document.getElementById("level6").style.display == "block"){
      document.getElementById("level6").style.display = "none";
    }else{
      document.getElementById("lang6").style.display = "none";
      document.getElementById("cate6").style.display = "none";
      document.getElementById("level6").style.display = "block";
    }
  }

  function checkLangAP7() {
      var lang=document.getElementsByName("language7[]");
      var isAP = true;
      for(var i=0;i<lang.length;i++){
        if(lang[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("langAP7")[0].checked = isAP;
  }
  function checkCateAP7() {
      var cate=document.getElementsByName("category7[]");
      var isAP = true;
      for(var i=0;i<cate.length;i++){
        if(cate[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("cateAP7")[0].checked = isAP;
  }
  function checkLevelAP7() {
      var level=document.getElementsByName("level7[]");
      var isAP = true;
      for(var i=0;i<level.length;i++){
        if(level[i].checked==false){
          isAP = false;
        }
    }
    document.getElementsByName("levelAP7")[0].checked = isAP;
  }
  function flangAP7(){
    var ap=document.getElementsByName("langAP7")[0].checked;
    var lang=document.getElementsByName("language7[]");
    if(ap==true){
      for(var i=0;i<lang.length;i++){
        lang[i].checked = true;
      }
    }else{
      for(var i=0;i<lang.length;i++){
        lang[i].checked = false;
      }
    }
  }
  function fcateAP7(){
    var ap=document.getElementsByName("cateAP7")[0].checked;
    var cate=document.getElementsByName("category7[]");
    if(ap==true){
      for(var i=0;i<cate.length;i++){
        cate[i].checked = true;
      }
    }else{
      for(var i=0;i<cate.length;i++){
        cate[i].checked = false;
      }
    }
  }
  function flevelAP7(){
    var ap=document.getElementsByName("levelAP7")[0].checked;
    var level=document.getElementsByName("level7[]");
    if(ap==true){
      for(var i=0;i<level.length;i++){
        level[i].checked = true;
      }
    }else{
      for(var i=0;i<level.length;i++){
        level[i].checked = false;
      }
    }
  }
  function showLang7(){
    if(document.getElementById("lang7").style.display == "block"){
      document.getElementById("lang7").style.display = "none";
    }else{
      document.getElementById("lang7").style.display = "block";
      document.getElementById("cate7").style.display = "none";
      document.getElementById("level7").style.display = "none";
    }
  }
  function showCate7(){
    if(document.getElementById("cate7").style.display == "block"){
      document.getElementById("cate7").style.display = "none";
    }else{
      document.getElementById("lang7").style.display = "none";
      document.getElementById("cate7").style.display = "block";
      document.getElementById("level7").style.display = "none";
    }
  }
  function showLevel7(){
    if(document.getElementById("level7").style.display == "block"){
      document.getElementById("level7").style.display = "none";
    }else{
      document.getElementById("lang7").style.display = "none";
      document.getElementById("cate7").style.display = "none";
      document.getElementById("level7").style.display = "block";
    }
  }

  function show1(){
    document.getElementById("1").style.display = "block";
    document.getElementById("2").style.display = "none";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "none";
    document.getElementById("5").style.display = "none";
    document.getElementById("6").style.display = "none";
    document.getElementById("7").style.display = "none";
  }
  function show2(){
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "block";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "none";
    document.getElementById("5").style.display = "none";
    document.getElementById("6").style.display = "none";
    document.getElementById("7").style.display = "none";
  }
  function show3(){
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "none";
    document.getElementById("3").style.display = "block";
    document.getElementById("4").style.display = "none";
    document.getElementById("5").style.display = "none";
    document.getElementById("6").style.display = "none";
    document.getElementById("7").style.display = "none";
  }
  function show4(){
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "none";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "block";
    document.getElementById("5").style.display = "none";
    document.getElementById("6").style.display = "none";
    document.getElementById("7").style.display = "none";
  }
  function show5(){
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "none";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "none";
    document.getElementById("5").style.display = "block";
    document.getElementById("6").style.display = "none";
    document.getElementById("7").style.display = "none";
  }
  function show6(){
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "none";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "none";
    document.getElementById("5").style.display = "none";
    document.getElementById("6").style.display = "block";
    document.getElementById("7").style.display = "none";
  }
  function show7(){
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "none";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "none";
    document.getElementById("5").style.display = "none";
    document.getElementById("6").style.display = "none";
    document.getElementById("7").style.display = "block";
  }
*/


