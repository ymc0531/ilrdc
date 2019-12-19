$(document).ready(function() {
  initFamily();
  initCategory();
  initTitle();
  initFirstEditionWord();
  initLatestCheckedWord();
  initPastYearWord();
  initSuggest();
  updateDownload();
  //test();
});

function test(){
  $('#page-1').css('display', 'none');
  $('#page-5').css('display', 'block');
}

function initFamily() {
  (async () => {

    let result = await getFamilyAjax();

    for(var i=0;i<7;i++){
      $('#langtype').append(`
        <input onclick="showSubLang(this.id)" id="${result[i].family_id}" class="row row1" type="button" value="${result[i].family}">
      `);
    }

    for(var i=7;i < 16;i++){
      $('#langtype1').append(`
        <input name="${result[i].family_id}" class="row row2" type="button" onclick="chooseLang(this.value)" value="${result[i].family}">
      `);
    }

  })()
}

async function getFamilyAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/getFamily',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function showLang(){
  $(".sublang").css("display", "none");
  $(".langbox").toggle();
};

function showSubLang(id){
  (async () => {

    let result = await getLanguageAjax();
    
    $('#sublang').empty();
    for (var i = 0; i < result.length; i++) {
      if(result[i].family_id==id){
        $('#sublang').append("<input name='chooselang' class='row3' type='button' onclick='chooseLang(this.value)' value='" + result[i].language + "'>");
      }
    }
    $("#sublang").css('display', 'block');

  })()
};

async function getLanguageAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentence/getLanguage',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initCategory() {
  (async () => {

    let result = await getCategoryAjax();
    let tmp = '';
    let count, index;

    tmp = `<div class="cate-row">`;
    for(let i=1;i<=6;i++){
      index = result.findIndex(x => x.cate_id == i);
      tmp = `
              ${tmp}<p class="cell1">${i}. ${result[index].cate}</p>
            `
    }
    tmp = `${tmp}</div>`;

    for(let i=1;i<=10;i++){
      tmp = `${tmp}<div class="cate-row">`;
      for(let j=1;j<=6;j++){
        index = result.findIndex(x => x.cate_id == j && x.subcate_id == i);
        if(index>=0){
          tmp = `${tmp}<p class="cell" onclick="chooseCate('${result[index].subcate}')">${j}-${i} ${result[index].subcate}</p>`
        }else{
          tmp = `${tmp}<p class="cell1"> </p>`
        }
      }
      tmp = `${tmp}</div>`
    }
    $('#cate').append(tmp);
  })()
}

async function getCategoryAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/getCategory',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initTitle() {
  (async () => {
    let result = await getSettingAjax();
    $('#page-1 .title .title-row-1').html(result[0].fey_title_row_1);
    $('#page-1 .title .title-row-2').html(result[0].fey_title_row_2);
    $('#page-2 .title .title-row-1').html(result[0].lcy_title_row_1);
    $('#page-2 .title .title-row-2').html(result[0].lcy_title_row_2);
    $('#page-3 .title .title-row-1').html(result[0].py_title_row_1);
    $('#page-3 .title .title-row-2').html(result[0].py_title_row_2);
  })()
}

async function getSettingAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/getSetting',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initFirstEditionWord() {
  let obj;
  let blurSearch = $('#blurSearch').prop('checked');
  let keyword = $('#keyword').val();
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let page = $('#pages-1').val();
  if(!page) page = 1;
  let data = {keyword: keyword, lang: lang, cate: cate, page: page, blurSearch: blurSearch};
  (async () => {
    let result = await getFeWordAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-1').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-1').append(`<option>${i}</option>`);
    }
    $('#pages-1').val(page);
    
    $('#page-1 .page-content-1').html('');
    if(result[1].length==0) {
      $('#page-1 .page-content-1').html('<p class="noResRow">查無此資料</p>');
    }
    for(let i=0;i<result[1].length;i++){
      $('#page-1 .page-content-1').append(`
        <table data-id="${result[1][i].id}">
          <tr>
            <td style="width: 5%;">
              ${i+1}
            </td>
            <td style="width: 10%;">
              ${result[1][i].cate}
            </td>
            <td style="width: 10%;">
              ${result[1][i].subcate}
            </td>
            <td style="width: 6%;">
              ${result[1][i].season}
            </td>
            <td style="width: 10%;">
              ${result[1][i].dialect}
            </td>
            <td style="width: 15%;">
              ${result[1][i].ab}
            </td>
            <td style="width: 10%;">
              ${result[1][i].ch}
            </td>
            <td style="width: 14%;">
              ${result[1][i].mean}
            </td>
            <td style="width: 14%;">
              ${result[1][i].description}
            </td>
            <td style="width: 6%;">
              <i class="material-icons edit-icon" onclick="showSuggestModal(${result[1][i].id})">border_color</i>
            </td>
          </tr>
        </table>
      `);
    }
  })()
}

async function getFeWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/getFeWord',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initLatestCheckedWord() {
  let str, obj;
  let blurSearch = $('#blurSearch').prop('checked');
  let keyword = $('#keyword').val();
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let page = $('#pages-2').val();
  if(!page) page = 1;
  let data = {keyword: keyword, lang: lang, cate: cate, page: page, blurSearch: blurSearch};
  (async () => {
    let result = await getLcWordAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-2').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-2').append(`<option>${i}</option>`);
    }
    $('#pages-2').val(page);
    
    $('#page-2 .page-content-1').html('');
    if(result[1].length==0) {
      $('#page-2 .page-content-1').html('<p class="noResRow">查無此資料</p>');
    }
    for(let i=0;i<result[1].length;i++){
      $('#page-2 .page-content-1').append(`
        <table>
          <tr>
            <td style="width: 5%;">
              ${i+1}
            </td>
            <td style="width: 10%;">
              ${result[1][i].cate}
            </td>
            <td style="width: 10%;">
              ${result[1][i].subcate}
            </td>
            <td style="width: 6%;">
              ${result[1][i].season}
            </td>
            <td style="width: 10%;">
              ${result[1][i].dialect}
            </td>
            <td style="width: 15%;">
              ${result[1][i].ab}
            </td>
            <td style="width: 10%;">
              ${result[1][i].ch}
            </td>
            <td style="width: 14%;">
              ${result[1][i].mean}
            </td>
            <td style="width: 14%;">
              ${result[1][i].description}
            </td>
            <td style="width: 6%;">
              <i class="material-icons edit-icon" onclick="showSuggestModal(${result[1][i].id})">border_color</i>
            </td>
          </tr>
        </table>
      `);
    }
  })()
}

async function getLcWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/getLcWord',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initPastYearWord() {
  let isAudio, isAudioEx;
  let blurSearch = $('#blurSearch').prop('checked');
  let keyword = $('#keyword').val();
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let page = $('#pages-3').val();
  if(!page) page = 1;
  let data = {keyword: keyword, lang: lang, cate: cate, page: page, blurSearch: blurSearch};
  (async () => {
    let audioFile = await getAudioFileAjax();
    let result = await getPyWordAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-3').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-3').append(`<option>${i}</option>`);
    }
    $('#pages-3').val(page);
    
    $('#page-3 .page-content-1').html('');
    if(result[1].length==0) {
      $('#page-3 .page-content-1').html('<p class="noResRow">查無此資料</p>');
    }
    for(let i=0;i<result[1].length;i++){
      isAudio = '';
      isAudioEx = '';
      if(audioFile.find(x => x == `word-${result[1][i].id}.wav`)) {
        isAudio = `<i class="material-icons edit-icon" onclick="playAudio('word-${result[1][i].id}.wav')">volume_up</i>`;
      }
      if(audioFile.find(x => x == `ex-${result[1][i].id}.wav`)){
        isAudioEx = `<i class="material-icons edit-icon" onclick="playAudio('ex-${result[1][i].id}.wav')">volume_up</i>`;
      }
      $('#page-3 .page-content-1').append(`
        <table>
          <tr>
            <td style="width: 5%;">
              ${i+1}
            </td>
            <td style="width: 7%;">
              ${result[1][i].season}
            </td>
            <td style="width: 16%;">
              ${result[1][i].dialect}
            </td>
            <td style="width: 30%;">
              <p class="clickable" onclick="showHc('hc-${i}')">${result[1][i].ab}</p>
            </td>
            <td style="width: 30%;">
              ${result[1][i].ch}
            </td>
            <td style="width: 6%;">
              ${isAudio}
            </td>
            <td style="width: 6%;">
              <i class="material-icons edit-icon" onclick="showSuggestModal(${result[1][i].id})">border_color</i>
            </td>
          </tr>
        </table>
        <div id="hc-${i}" class="hidden-content">
          <div class="hc-row">
            <div class="hc-row-title">
              語意
            </div>
            <div>
              ${result[1][i].mean}
            </div>
          </div>
          <div class="hc-row">
            <div class="hc-row-title">
              說明
            </div>
            <div>
              ${result[1][i].description}
            </div>
          </div>
          <div class="hc-row">
            <div class="hc-row-title">
              例句${isAudioEx}
            </div>
            <div>
              ${result[1][i].ab_example}
            </div>
            <div>
              ${result[1][i].ch_example}
            </div>
          </div>
          <div class="hc-row">
            <div class="hc-row-title">
              相關詞彙
            </div>
            <div>
            </div>
          </div>
        </div>
      `);
    }
  })()
}

async function getAudioFileAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/files',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getPyWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/getPyWord',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initSuggest() {
  let time;
  let page = $('#pages-5').val();
  if(!page) page = 1;
  let data = {page: page};
  (async () => {
    let result = await getSuggestAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-5').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-5').append(`<option>${i}</option>`);
    }
    $('#pages-5').val(page);
    
    $('#page-5 .page-content-1').html('');
    for(let i=0;i<result[1].length;i++){
      if(result[1][i].username.substr(0,1)=='*') 
        result[1][i].username = '***';
      time = result[1][i].create_time.substr(0, 10);
      $('#page-5 .page-content-1').append(`
        <table>
          <tr>
            <td style="width: 4%;">
              ${i+1}
            </td>
            <td style="width: 12%;">
              ${time}
            </td>
            <td style="width: 2%;">
              ${result[1][i].event}
            </td>
            <td style="width: 2%;">
              ${result[1][i].cate}
            </td>
            <td style="width: 2%;">
              ${result[1][i].subcate}
            </td>
            <td style="width: 5%;">
              ${result[1][i].season}
            </td>
            <td style="width: 10%;">
              ${result[1][i].dialect}
            </td>
            <td style="width: 16%;">
              ${result[1][i].ab}
            </td>
            <td style="width: 10%;">
              ${result[1][i].ch}
            </td>
            <td style="width: 15%;">
              ${result[1][i].suggestion}
            </td>
            <td style="width: 8%;">
              ${result[1][i].username}
            </td>
            <td style="width: 15%;">
              ${result[1][i].feedback}
            </td>
          </tr>
        </table>
      `);
    }
  })() 
}

async function getSuggestAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/suggest',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}



function showCate(){
  if($("#cate").css('display')=='none'){
    $("#cate").css('display', 'block');
  }else{
    $("#cate").css('display', 'none');
  }
};

function showPage(num) {
  let prev = $('.page-title').attr('data-act-page');
  $(`#btn${prev}`).removeClass('act-btn');
  $(`#btn${num}`).addClass('act-btn');
  $('.page-title').attr('data-act-page', `${num}`);
  $(`#page-${prev}`).css('display', 'none');
  $(`#page-${num}`).css('display', 'block');
}

function searchWord() {
  $('#pages-1').val('1');
  $('#pages-2').val('1');
  $('#pages-3').val('1');
  closeLang();
  closeCate();
  initAll();
}

function selectAllLang() {
  $('#currlang').val('全語言');
  $('#pages-1').val('1');
  $('#pages-2').val('1');
  $('#pages-3').val('1');
  closeLang();
  closeCate();
  initAll();
}

function selectAllCate() {
  $('#currcate').val('全分類');
  $('#pages-1').val('1');
  $('#pages-2').val('1');
  $('#pages-3').val('1');
  closeLang();
  closeCate();
  initAll();
}

function chooseLang(value){
  $('#currlang').val(value);
  $('#pages-1').val('1');
  $('#pages-2').val('1');
  $('#pages-3').val('1');
  closeLang();
  closeCate();
  initAll();
};

function chooseCate(value){
  $('#currcate').val(value);
  $('#pages-1').val('1');
  $('#pages-2').val('1');
  $('#pages-3').val('1');
  closeLang();
  closeCate();
  initAll();
};

function closeLang() {
  $('.langbox').css('display', 'none');
}

function closeCate() {
  $('#cate').css('display', 'none');
}

function closeModal(mdl) {
  $(`#${mdl}`).css('display', 'none');
}

function confirmChecker(){
  confirmModal.style.display = "block";
};

function suggestSubmit() {
  let hideUser = $('#hideUser').prop('checked');
  let id = $('#suggestModal').attr('data-id');
  let season = $('#suggestModal').attr('data-season');
  let event = $('.page-title').attr('data-act-page');
  let dialect = $('#s_dialect').html();
  let ab = $('#s_ab').html();
  let ch = $('#s_ch').html();
  let cate = $('#s_cate').html();
  let subcate = $('#s_subcate').html();
  let suggestion = $('#textsuggestion').val();
  let data = {id: id, season: season, dialect: dialect, ab: ab, ch: ch, cate: cate, subcate: subcate, suggestion: suggestion, event: event, hideUser: hideUser};
  (async () => {
    await suggestInsAjax(data);
  })()
  $('#confirmModal').css('display', 'none');
  $('#suggestModal').css('display', 'none');
}

async function suggestInsAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/suggest',
      type: 'PUT',
      data: data,
      statusCode: {
        200: function() {
          initSuggest();
        },
        400: function() {
          alert('無法提交。');
        },
        401: function() {
          if(confirm('需先登入才可填寫建議。\n是否前往登入？')) {
            window.open('/');
          }
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function cancelSubmit() {
  closeModal('confirmModal');
}

function initAll() {
  initFirstEditionWord();
  initLatestCheckedWord();
  initPastYearWord();
  updateDownload();
}

function updateDownload() {
  $('#page-4 .dlcontent p').html(`${$('#currlang').val()} ${$('#currcate').val()}`);
}

function changepage(num) {
  switch(num) {
    case 1:
      initFirstEditionWord();
      break;
    case 2:
      initLatestCheckedWord();
      break;
    case 3:
      initPastYearWord();
      break;
    case 5:
      initSuggest();
      break;
  }
}

function prevpage(num) {
  let currpage = parseInt($(`#pages-${num}`).val(), 10);
  if(currpage>1){
    $(`#pages-${num}`).val(currpage-1);
    switch(num) {
      case 1:
        initFirstEditionWord();
        break;
      case 2:
        initLatestCheckedWord();
        break; 
      case 3:
        initPastYearWord();
        break;
      case 5:
        initSuggest();
        break;
    }
  }
}

function nextpage(num) {
  let currpage = parseInt($(`#pages-${num}`).val(), 10);
  let maxpage = $(`#pages-${num}`).children().length;
  if(currpage < maxpage){
    $(`#pages-${num}`).val(currpage+1);
    switch(num) {
      case 1:
        initFirstEditionWord();
        break;
      case 2:
        initLatestCheckedWord();
        break; 
      case 3:
        initPastYearWord();
        break;
      case 5:
        initSuggest();
        break;
    }
  }
}

function showHc(num) {
  if($(`#${num}`).css('display')=='none'){
    $(`#${num}`).css('display', 'block');
  }else{
    $(`#${num}`).css('display', 'none');
  }
}

function showSuggestModal(id){
  let data = {id: id};
  (async () => {
    let result = await getWordAjax(data);
    $('#suggestModal').attr('data-id', result[0].id);
    $('#suggestModal').attr('data-season', result[0].season);
    $('#s_ab').html(result[0].ab);
    $('#s_ch').html(result[0].ch);
    $('#s_cate').html(result[0].cate);
    $('#s_subcate').html(result[0].subcate);
    $('#s_dialect').html(result[0].dialect);
    $('#s_ab_1').html(result[0].ab);
    $('#s_ch_1').html(result[0].ch);
    $('#s_ab_2').html(result[0].ab);
    $('#s_ch_2').html(result[0].ch);
    $('#s_ab_ex').html(result[0].ab_example);
    $('#s_ch_ex').html(result[0].ch_example);
    $('#s_ab_ex_1').html(result[0].ab_example);
    $('#s_ch_ex_1').html(result[0].ch_example);
    $('#suggestModal').css('display', 'flex');
  })()
  /*$('#suggestModal').attr('data-id', id);
  $('#suggestModal').attr('data-season', season);
  $('#s_ab').html(ab);
  $('#s_ch').html(ch);
  $('#s_cate').html(cate);
  $('#s_subcate').html(subcate);
  $('#s_dialect').html(dialect);
  $('#s_ab_1').html(ab);
  $('#s_ch_1').html(ch);
  $('#s_ab_2').html(ab);
  $('#s_ch_2').html(ch);
  $('#s_ab_ex').html(ab_example);
  $('#s_ch_ex').html(ch_example);
  $('#s_ab_ex_1').html(ab_example);
  $('#s_ch_ex_1').html(ch_example);
  $('#suggestModal').css('display', 'flex');*/
}

async function getWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/getWord',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function insSymbol(a) {
  var kw = document.getElementById("keyword");
  kw.value = `${kw.value}${a}`;
}

function download() {
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let data = {lang: lang, cate: cate};
  let result, tmpResult;
  result = [{season: '年度', language: '語言', dialect: '方言', cate: '主分類', subcate: '次分類', ab: '族語詞彙', ch: '中文詞彙', word_formation: '構詞法', ab_example: '族語例句', ch_example: '中文例句', example_type: '句型', remark: '備註'}];
  if(lang!='全語言'){
    (async () => {
      tmpResult = await wordsDownloadAjax(data);
      for(let i=0;i<tmpResult.length;i++){
        result.push(tmpResult[i]);
      }
      JSONToCSVConvertor(result, '下載', false);
    })()
  }else{
    alert('全語言檔案太大無法下載，請選擇語言。')
  }
}

async function wordsDownloadAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWord/download',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function playAudio(file) {
  let x = document.getElementById('arAudio');
  $('#arAudio').find('source').prop('src', `/audio/newWord/${file}`);
  x.load();
  x.play();
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
  var fileName = "新詞_";
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

