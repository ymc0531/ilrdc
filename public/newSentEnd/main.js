$(document).ready(function(){
  $('#btn2').css('background-color', '#ACACAC');
  $('#2').css('display', 'block');
  $('#a-o-family').val('阿美');
  
  sidebarToggle();
  initLanguage();
  initCategory();
  initOperator();
  initStatusOperator();
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
    $('#confirmModal').css('display', 'flex');
  });

  //test();
})

pageSetting();

function test() {
  $('#applyOperatorModal').css('display', 'flex');
}

function pageSetting() {
  (async () => {
    let result = await getPrivilegeAjax();
    switch(result[0].privilege) {
      case 1:
        $('#btn2').css('display', 'none');
        $('#btn3').css('display', 'none');
        $('#2').html('');
        $('#3').html('');
        document.getElementById('btn4').click();
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
    let lastEdit;

    $('#workTable').html('');    
    for(let i=0;i<result.length;i++){
      lastEdit = '';
      if(result[i].last_edit) {
        lastEdit = `${result[i].last_edit.substr(0,10)}, ${result[i].last_edit.substr(11,5)}`;
      }
      if(result[i].status==100){
        status = `<p class="nm done" onclick="updateProgress(${result[i].id}, ${result[i].status})">已完成</p>`
      }else{
        status = `<p class="nm undone" onclick="updateProgress(${result[i].id}, ${result[i].status})">未完成 ${result[i].status}%</p>`
      }
      $('#workTable').append(`
        <tr>
          <td style="width: 5%">
            <a class="delete-btn nm" onclick="deleteOperator('${result[i].id}')">刪除</a>
          </td>
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
            <p class="nm clickable" onclick="goPlatform(${result[i].id})">${result[i].dialect}詞表平台</p>
          </td>
          <td style="width: 25%">
            <p class="nm">${lastEdit}</p>
          </td>
          <td style="width: 5%">
            <p class="nm clickable" onclick="applyOperator('${result[i].id}','${result[i].dialect}')">指派</p>
          </td>
        </tr>
      `);
    }
  })()
}

function deleteOperator(id) {
  let data = {id: id};
  if(confirm('確認刪除')) {
    (async () => {
      await deleteOperatorAjax(data);
      initOperator();
    })()
  }
}

async function deleteOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/operator',
      type: 'DELETE',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function updateProgress(id, status) {
  $('#statusModal #status').attr('data-id', id);
  $('#statusModal #status').val(status);
  $('#statusModal').css('display', 'flex');
}

function confirmProgress() {
  let id = $('#statusModal #status').attr('data-id');
  let status = parseInt($('#statusModal #status').val(), 10);
  if(status<0) status = 0;
  if(status>100) status = 100;
  let data = {id: id, status: status};
  (async () => {
    await updateProgressAjax(data);
    initOperator();
    initStatusOperator();
  })()
  closeModal('statusModal');
}

async function updateProgressAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/updateProgress',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initStatusOperator() {
  (async () => {
    let result = await statusOperatorAjax();

    $('#oTable').html('');
    for(let i=0;i<result.length;i++){
      if(i%2==0) bgColor = `'white'`;
      else bgColor = `#E1E0E0`;
      $('#oTable').append(`
        <tr style="background-color: ${bgColor}">
          <td style="width: 7%">
            <a class="confirm-btn font12vw" onclick="showConfirmModal3('${result[i].id}', this)">確認</a>&nbsp;
          </td>
          <td style="width: 10%">
            <p class="nm">${result[i].family}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[i].dialect}</p>
          </td>
          <td class="op-sid" style="width: 8%">
            <input class="nm1" type="text" value="${result[i].sid}">
          </td>
          <td style="width: 15%">
            <p class="nm clickable" onclick="allDataDownload('${result[i].dialect}')">${result[i].dialect}語詞表資料</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[i].username}</p>
          </td>
          <td style="width: 15%">
            <p class="nm clickable" onclick="goPlatform()">${result[i].dialect}語詞表平台</p>
          </td>
          <td class="op-pw" style="width: 10%">
            <input class="nm1" type="text" value="${result[i].password}">
          </td>
          <td style="width: 15%">
            <p class="nm">${result[i].last_edit.substr(0,10)}, ${result[i].last_edit.substr(11,5)}</p>
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

async function getOperatorAjax() {
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

async function statusOperatorAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/statusOperator',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/updateOperator',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateOperatorTimeAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/updateOperatorTime',
      type: 'PUT',
      data: data
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

async function wordsDownloadAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/wordsDownload',
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

async function applyOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/operator',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function searchOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/searchOperator',
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
    let level;
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
        level = getLevel(result[1][i]);
        if(i%2==0) bgColor = `'white'`;
        else bgColor = `#E1E0E0`;
        $('#sTable').append(`
          <tr style="background-color: ${bgColor}">
            <td style="width: 7.5%;">
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
              <p class="nm">${level}</p>
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
    let level;
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
        level = getLevel(result[1][i]);
        if(i%2==0) bgColor = `'white'`;
        else bgColor = `#E1E0E0`;
        $('#wTable').append(`
          <tr style="background-color: ${bgColor}">
            <td style="width: 7.5%;">
              <a class="confirm-btn" onclick="showEditModal4('${result[1][i].id}')">編輯</a>&nbsp;/
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
              <p class="nm">${level}</p>
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

function getLevel(res) {
  let level = '?';
  if(res.LanLevelE==1) level = '初級';
  if(res.LanLevelM==1) level = '中級';
  if(res.LanLevelMH==1) level = '中高級';
  if(res.LanLevelH==1) level = '高級';
  return level;
}

function showEditModal4(id) {
  let level = '';
  let data = {id: id};
  (async () => {
    let result = await getWordAjax(data);
    if(result[0].LanLevelE==1) level = '初級';
    if(result[0].LanLevelM==1) level = '中級';
    if(result[0].LanLevelMH==1) level = '中高級';
    if(result[0].LanLevelH==1) level = '高級';
    $('#editModal').attr('data-id', result[0].id);
    $('#edialect').html(result[0].dialect);
    $('#ecate').html(result[0].category);
    $('#elevel').val(level);
    $('#ectws').html(result[0].ctws);
    $('#eftws').html(result[0].ftws);
    $('#efex').val(result[0].fexam);
    $('#ecex').val(result[0].cexam);
    $('#ememo').val(result[0].memo);
    $('#editModal').css('display', 'flex');
  })()
}

async function getWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/getWord',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editSubmit() {
  let id = $('#editModal').attr('data-id');
  let level = $('#elevel').val();
  let fexam = $('#efex').val();
  let cexam = $('#ecex').val();
  let memo = $('#ememo').val();
  let data = {id: id, level: level, fexam: fexam, cexam: cexam, memo: memo};
  (async () => {
    await editWordAjax(data);
    closeModal('editModal');
    initWords();
  })()
}

async function editWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentEnd/word',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function allDataDownload(dialect) {
  let tmpResult;
  let data = {lang: `"'${dialect}'"`};
  let result = [{id: '序號', sid: '編號', dialect: '方言', category: '分類', snum: 'snum', ftws: '族語詞彙', ctws: '中文詞彙', fexam: '族語例句', cexam: '中文例句', LanLevelE: '初級', LanLevelM: '中級', LanLevelMH: '中高級', LanLevelH: '高級', workcheck: '審查', memo: '備註'}];
  (async () => {
    tmpResult = await wordsDownloadAjax(data);
    for(let i=0;i<tmpResult.length;i++){
      result.push(tmpResult[i]);
    }
    JSONToCSVConvertor(result, '詞表資料', false);
  })()
}

function operatorSearch() {
  let keyword = $('#operatorSearch').val();
  if(keyword==""||!keyword) {
    alert('請填寫搜尋欄位。')
  }else{
    let data = {keyword: keyword};
    (async () => {
      let result = await searchOperatorAjax(data);
      $('#applyOppTable').html('');
      for(let i=0;i<result.length;i++){
        $('#applyOppTable').append(`
          <tr>
            <td style="width: 10%">
              <p class="nm">${i+1}</p>
            </td>
            <td style="width: 15%">
              <p class="nm">${result[i].name_zh}</p>
            </td>
            <td style="width: 15%">
              <p class="nm">${result[i].name_ind}</p>
            </td>
            <td style="width: 15%">
              <p class="nm">${result[i].ind_dialect}</p>
            </td>
            <td style="width: 20%">
              <p class="nm">${result[i].current_addr}</p>
            </td>
            <td style="width: 10%">
              <p class="nm">${result[i].tribe_zh}</p>
            </td>
            <td style="width: 15%">
              <button class="btn3" onclick="confirmApplyOpp('${result[i].name_zh}')">確認</button>
            </td>
          </tr>
        `);
      }
    })()
  }
}

function confirmApplyOpp(name) {
  let data = {id: $('#applyOperatorModal').attr('data-id'), name: name};
  (async () => {
    await applyOperatorAjax(data);
    $('#applyOperatorModal').css('display', 'none');
    initOperator();
  })()
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

function showConfirmModal3(id, val) {
  let sid = $(val).parent().parent().find('.op-sid').children('input').val();
  let pw = $(val).parent().parent().find('.op-pw').children('input').val();
  $('#confirmModal3').attr('data-id', id);
  $('#confirmModal3').attr('data-sid', sid);
  $('#confirmModal3').attr('data-pw', pw);
  $('#confirmModal3').css('display', 'flex');
}

function allDataSubmit() {
  let id = $('#confirmModal3').attr('data-id');
  let sid = $('#confirmModal3').attr('data-sid');
  let pw = $('#confirmModal3').attr('data-pw');
  let data = {id: id, sid: sid, pw: pw};
  (async () => {
    let result = await updateOperatorAjax(data);
    initStatusOperator();
    $('#confirmModal3').css('display', 'none');
  })()
}

function allDataCancel() {
  $('#confirmModal3').css('display', 'none');
}

function showConfirmModal7(id, val) {
  let fb = $(val).parent().parent().find('.feedback').children('textarea').val();
  if(fb==''){
    alert('請填好資料再送出。')
  }else{
    $('#confirmModal').attr('data-id', id);
    $('#confirmModal').attr('data-fb', fb);
    $('#confirmModal').css('display', 'flex');
  }
}

function showDeleteModal4(id) {
  $('#deleteModal').attr('data-id', id);
  $('#deleteModal').attr('data-mode', '4');
  $('#deleteModal').css('display', 'flex');
}

function showDeleteModal7(id) {
  $('#deleteModal').attr('data-id', id);
  $('#deleteModal').attr('data-mode', '7');
  $('#deleteModal').css('display', 'flex');
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

function goPlatform(num) {
  if(num) {
    let data = {id: num};
    (async () => {
      await updateOperatorTimeAjax(data);
    })()
    initOperator();
  }
  window.open('http://210.61.46.35:8080/tow.ilrdc.tw/login/login.php', '_blank');
}

function openAddOperator() {
  $('#addOperatorModal').css('display', 'flex');
}

function closeAddOperator() {
  $('#addOperatorModal').css('display', 'none');
}

function applyOperator(id, dialect) {
  $('#applyOperatorModal').attr('data-id', id);
  $('.modal-title').html('');
  $('.modal-title').append(`作業員指派 - ${dialect}語詞表`);
  $('#applyOperatorModal').css('display', 'flex');
}

function closeApplyOperator() {
  $('#applyOperatorModal').css('display', 'none');
}

function closeModal(modal) {
  $(`#${modal}`).css('display', 'none');
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

function wordsDownload() {
  let result, tmpResult;
  let lang = document.getElementsByName('language4[]');
  let cate = document.getElementsByName('category4[]');
  let level = document.getElementsByName('level4[]');
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
    result = [{id: '序號', sid: '編號', dialect: '方言', category: '分類', snum: 'snum', ftws: '族語詞彙', ctws: '中文詞彙', fexam: '族語例句', cexam: '中文例句', LanLevelE: '初級', LanLevelM: '中級', LanLevelMH: '中高級', LanLevelH: '高級', workcheck: '審查', memo: '備註'}];
    (async () => {
      tmpResult = await wordsDownloadAjax(data);
      for(let i=0;i<tmpResult.length;i++){
        result.push(tmpResult[i]);
      }
      JSONToCSVConvertor(result, '詞彙', false);
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

