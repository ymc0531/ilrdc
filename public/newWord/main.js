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
  let keyword = $('#keyword').val();
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let page = $('#pages-1').val();
  if(!page) page = 1;
  let data = {keyword: keyword, lang: lang, cate: cate, page: page};
  (async () => {
    let result = await getFeWordAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-1').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-1').append(`<option>${i}</option>`);
    }
    $('#pages-1').val(page);
    
    $('#page-1 .page-content-1').html('');
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
  let keyword = $('#keyword').val();
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let page = $('#pages-2').val();
  if(!page) page = 1;
  let data = {keyword: keyword, lang: lang, cate: cate, page: page};
  (async () => {
    let result = await getLcWordAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-2').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-2').append(`<option>${i}</option>`);
    }
    $('#pages-2').val(page);
    
    $('#page-2 .page-content-1').html('');
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
  let keyword = $('#keyword').val();
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let page = $('#pages-3').val();
  if(!page) page = 1;
  let data = {keyword: keyword, lang: lang, cate: cate, page: page};
  (async () => {
    let result = await getPyWordAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-3').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-3').append(`<option>${i}</option>`);
    }
    $('#pages-3').val(page);
    
    $('#page-3 .page-content-1').html('');
    for(let i=0;i<result[1].length;i++){
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
              <i class="material-icons edit-icon">volume_up</i>
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
              例句
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
      time = result[1][0].create_time.substr(0, 10);
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
  let id = $('#suggestModal').attr('data-id');
  let season = $('#suggestModal').attr('data-season');
  let event = $('.page-title').attr('data-act-page');
  let dialect = $('#s_dialect').html();
  let ab = $('#s_ab').html();
  let ch = $('#s_ch').html();
  let cate = $('#s_cate').html();
  let subcate = $('#s_subcate').html();
  let suggestion = $('#textsuggestion').val();
  let data = {id: id, season: season, dialect: dialect, ab: ab, ch: ch, cate: cate, subcate: subcate, suggestion: suggestion, event: event};
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
      data: data
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

function download() {
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let data = {lang: lang, cate: cate};
  let result, tmpResult;
  result = [{season: '年度', language: '語言', dialect: '方言', cate: '主分類', subcate: '次分類', ab: '族語詞彙', ch: '中文詞彙', ab_example: '族語例句', ch_example: '中文例句', example_type: '句型', remark: '備註'}];
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

/*$(document).ready(function(){
  const obj = {language: "lang"};
  initFamily();
  initCategory();
  initWords();
  initSuggest();
});

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

function initCategory() {
  (async () => {

    let result = await getCategoryAjax();

    var tmp = '';
    for(var i=0;i<result.length;i+=6){
      tmp = `${tmp}<tr>`
      for(var j=0;j<6;j++){
        tmp = `
          ${tmp}
          <td>
            <input class="cell1" type="button" value="${result[i+j].cate}" id="${result[i+j].cate_id}" onclick="chooseCate(this.value)">
          </td>
        `
      }
      tmp = `${tmp}</tr>`
    }
    $('#cate table').append(tmp);

  })()
}

function initWords(lang, cate, keyword, pages) {
  (async () => {
    let blurSearch = $('#blurSearch').prop('checked');
    let rowPerPage = $('#rowPerPage').val();

    let result = await getWordsAjax(lang, cate, keyword, blurSearch, pages, rowPerPage);

    let page = Math.ceil(parseInt(result[0][0]['COUNT(*)'], 10)/rowPerPage);
    $('#page1').html('');
    for(var i=1;i<=page;i++){
      $('#page1').append(`
        <option value="${i}">${i}</option>
      `);
    }
    if(pages) $('#page1').val(pages);

    $('#learn #title-p').html('');
    $('#learn #title-p').append(`主題：${$('#currcate').val()}，&nbsp;共 ${result[0][0]['COUNT(*)']} 筆`);

    var tmp = '';
    var levelNum = 0;
    var levelCn = ['初級', '中級', '中高級', '高級'];

    for(var i=0;i < result[1].length;i++){
      var level = [result[1][i].LanLevelE,result[1][i].LanLevelM,result[1][i].LanLevelMH,result[1][i].LanLevelH];
      for(var j=0;j<4;j++){
        if(level[j]=="1") levelNum = j;
      }
      if(i%2==0){
        tmp = `${tmp}<div style="background-color: #f1f5f6">`
      }else{
        tmp = `${tmp}<div style="background-color: white">`
      }
      tmp = `
        ${tmp}
        <table class="ltable">
          <tr>
            <td rowspan = "2" class="lcol0">
              ${result[1][i].dialect}
            </td>
            <td rowspan = "2" class="lcol1">
              ${result[1][i].sid}
            </td>
            <td class="lcol2">
              ${result[1][i].ftws}
            </td>
            <td class="lcol3">
              ${result[1][i].fexam}
            </td>
            <td rowspan = "2" class="lcol4">
              ${levelCn[levelNum]}
            </td>
            <td rowspan = "2" class="lcol5">
              <i class="material-icons" onclick="showSuggestModal('${result[1][i].id}', '${result[1][i].ftws}', '${result[1][i].ctws}', '${result[1][i].fexam}', '${result[1][i].cexam}', '${result[1][i].category}')">border_color</i>
            </td>
          </tr>
          <tr>
            <td class="lcol2">
              ${result[1][i].ctws}
            </td>
            <td class="lcol3">
              ${result[1][i].cexam}
            </td>
          </tr>
        </table>
        </div>
      `
    }
    $('#wordsResult').html('');
    $('#wordsResult').append(tmp);

  })()
}

function initSuggest() {
  let pages = $('#page2').val();
  if(!pages) pages = 1;
  let rowPerPage = $('#rowPerPage2').val();
  let data = {pages: pages, rowPerPage: rowPerPage};
  (async () => {
    let result = await getSuggestAjax(data);

    let page = Math.ceil(parseInt(result[0][0]['COUNT(*)'], 10)/rowPerPage);
    $('#page2').html('');
    for(var i=1;i<=page;i++){
      $('#page2').append(`
        <option value="${i}">${i}</option>
      `);
    }
    if(pages) $('#page2').val(pages);

    $('#suggest #title-p').html('');
    $('#suggest #title-p').append(`主題：${$('#currcate').val()}，&nbsp;共 ${result[0][0]['COUNT(*)']} 筆`);

    var tmp = '';
    var dateObj, month, day, year, newdate, tmpFeedback;
    for(var i=0;i < result[1].length;i++){
      newdate = result[1][i].time.substr(0, 10);
      if(result[1][i].admin_feedback==""){
        tmpFeedback = `<p>審查中</p>`;
      }else{
        tmpFeedback = `<p class="btn2" onclick="showFeedback(this)" data-result="${result[1][i].admin_feedback}">審查完成</p>`
      }

      if(i%2==0){
        tmp = `${tmp}<div style="background-color: #f1f5f6">`
      }else{
        tmp = `${tmp}<div style="background-color: white">`
      }
      tmp = `
        ${tmp}
        <table class="stable">
          <tr>
            <td rowspan = "2" class="scol1">
              ${i+1}
            </td>
            <td rowspan = "2" class="scol2">
              ${newdate}
            </td>
            <td class="scol3">
              ${result[1][i].ftws}
            </td>
            <td class="scol4">
              ${result[1][i].fexam}
            </td>
            <td rowspan = "2" class="scol5">
              <p>初級</p>
            </td>
            <td rowspan = "2" class="scol6">
              ${result[1][i].suggestion}
            </td>
            <td rowspan = "2" class="scol7">
              ${result[1][i].user}
            </td>
            <td rowspan = "2" class="scol8">
              ${tmpFeedback}
            </td>
          </tr>
          <tr>
            <td class="scol3">
              ${result[1][i].ctws}
            </td>
            <td class="scol4">
              ${result[1][i].cexam}
            </td>
          </tr>
        </table>
        </div>
      `
    }
    $('#suggestResult').html('');
    $('#suggestResult').append(tmp);
  })()
}

async function getFamilyAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentence/getFamily',
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
      url: '/newSentence/getCategory',
      type: 'GET'
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
      url: '/newSentence/getLanguage',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getWordsAjax(lang, cate, keyword, blurSearch, pages, rowPerPage) {
  let result;
  let data = {lang: lang, cate: cate, keyword: keyword, blurSearch: blurSearch, pages: pages, rowPerPage: rowPerPage};
  try {
    result = await $.ajax({
      url: '/newSentence/getWords',
      type: 'POST',
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
      url: '/newSentence/getSuggest',
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
      url: '/newSentence/wordsDownload',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function suggestInsAjax(words_id, ftws, ctws, fexam, cexam, suggestion) {
  let result;
  let data = {words_id: words_id, ftws: ftws, ctws: ctws, fexam: fexam, cexam: cexam, suggestion: suggestion};
  try {
    result = await $.ajax({
      url: '/newSentence/suggest',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

for(var i=0;i < Math.ceil(parseInt("<%=tpage%>", 10)/50);i++){   
  $('#page1').append(`<option value='${i+1}'>${i+1}</option>`);
}

$('#cmd').click(function () {
  let lang = $('#currlang').val();
  let cate = $('#currcate').val();
  let data = {lang: lang, cate: cate};
  let result, tmpResult;
  result = [{dialect: '方言', category: '分類', ftws: '族語詞彙', ctws: '中文詞彙', fexam: '族語例句', cexam: '中文例句', memo: '備註'}];
  (async () => {
    tmpResult = await wordsDownloadAjax(data);
    for(let i=0;i<tmpResult.length;i++){
      result.push(tmpResult[i]);
    }
    JSONToCSVConvertor(result, '下載', false);
  })()
});

var suggestModal = document.getElementById("suggestModal");
var feedback = document.getElementById("feedback");

function closeModal(){
  suggestModal.style.display = "none";
};

function confirmChecker(){
  confirmModal.style.display = "block";
};

function cancelSubmit(){
  confirmModal.style.display = "none";
};

function closeFeedback(){
  feedback.style.display = "none";
}

function showLang(){
  $(".sublang").css("display", "none");
  $(".langbox").toggle();
};

function showCate(){
  $("#cate").toggle();
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

function showLearn(){
  $('#learn').css('display', 'block');
  $('#suggest').css('display', 'none');
  $('#download').css('display', 'none');
  $('#lbtn').css({'background-color': '#d5dfe3'});
  $('#sbtn').css({'background-color': '#f1f5f6'});
  $('#dbtn').css({'background-color': '#f1f5f6'});
}

function showDownload(){
  $('#learn').css('display', 'none');
  $('#suggest').css('display', 'none');
  $('#download').css('display', 'block');
  $('#lbtn').css({'background-color': '#f1f5f6'});
  $('#sbtn').css({'background-color': '#f1f5f6'});
  $('#dbtn').css({'background-color': '#d5dfe3'});
  $('.dlcontent p').html(`${$('#currlang').val()} ${$('#currcate').val()} `);
}

function showSuggest(){
  $('#learn').css('display', 'none');
  $('#suggest').css('display', 'block');
  $('#download').css('display', 'none');
  $('#lbtn').css({'background-color': '#f1f5f6'});
  $('#sbtn').css({'background-color': '#d5dfe3'});
  $('#dbtn').css({'background-color': '#f1f5f6'});
  initSuggest();
}

function showSuggestModal(id, ftws, ctws, fexam, cexam, category){
  $('#suggestModal').attr('data-id', id);
  $("#ftws").html(ftws);
  $("#ctws").html(ctws);
  $("#ftws1").html(ftws);
  $("#ctws1").html(ctws);
  $("#textftws").html(ftws);
  $("#textctws").html(ctws);
  $("#fexam").html(fexam);
  $("#cexam").html(cexam);
  $("#fexam1").html(fexam);
  $("#cexam1").html(cexam);
  $("#textfexam").html(fexam);
  $("#textcexam").html(cexam);
  $("#category").html(category.substr(2));
  suggestModal.style.display = "flex";
}

function selectAllLang(){
  $('#currlang').val('全語言');
  initWords(undefined, $('#currcate').val(), $('#keyword').val());
  closeLang();
  closeCate();
};

function selectAllCate(){
  $('#currcate').val('全分類');
  initWords($('#currlang').val(), undefined, $('#keyword').val());
  closeLang();
  closeCate();
};

function searchSub(){
  initWords($('#currlang').val(), $('#currcate').val(), $('#keyword').val());
}

function chooseLang(value){
  $('#currlang').val(value);
  closeLang();
  closeCate();
  initWords(value, $('#currcate').val(), $('#keyword').val());
  $('.dlcontent p').html(`${$('#currlang').val()} ${$('#currcate').val()} `);
};

function chooseCate(id, value){
  $('#currcate').val(value);
  closeLang();
  closeCate();
  initWords($('#currlang').val(), value, $('#keyword').val());
  $('.dlcontent p').html(`${$('#currlang').val()} ${$('#currcate').val()} `);
};

function showFeedback(val){
  $('#fbResult').html($(val).attr('data-result'));
  feedback.style.display = "block";
}

$('#suggestForm').on('keyup keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) { 
  e.preventDefault();
  return false;
  }
});

function insSymbol(a) {
  var kw = document.getElementById("keyword");
  kw.value = `${kw.value}${a}`;
}

function changepage() {
  initWords($('#currlang').val(), $('#currcate').val(), $('#keyword').val(), $('#page1').val());
}

function prevpage() {
  let currpage = parseInt($('#page1').val(), 10);
  if(currpage>1){
    $('#page1').val(currpage-1)
    initWords($('#currlang').val(), $('#currcate').val(), $('#keyword').val(), currpage-1);
  }
}
function nextpage() {
  let currpage = parseInt($('#page1').val(), 10);
  let maxpage = $('#page1').children().length;
  if(currpage < maxpage){
    $('#page1').val(currpage+1)
    initWords($('#currlang').val(), $('#currcate').val(), $('#keyword').val(), currpage+1);
  }
}

function changeRowPerPage() {
  $('#page1').val('1');
  initWords($('#currlang').val(), $('#currcate').val(), $('#keyword').val(), '1');
}

function changepage2() {
  initSuggest();
}

function prevpage2() {
  let currpage = parseInt($('#page').val(), 10);
  if(currpage>1){
    $('#page2').val(currpage-1);
    initSuggest();
  }
}
function nextpage2() {
  let currpage = parseInt($('#page2').val(), 10);
  let maxpage = $('#page2').children().length;
  if(currpage < maxpage){
    $('#page2').val(currpage+1);
    initSuggest();
  }
}

function changeRowPerPage2() {
  $('#page2').val('1');
  initSuggest();
}

function closeLang() {
  $('.sublang').css('display', 'none');
  $('.langbox').css('display', 'none');
}

function closeCate() {
  $('#cate').css('display', 'none');
}

function suggestSubmit() {
  var words_id = $('#suggestModal').attr('data-id');
  var ftws = $('#textftws').val();
  var ctws = $('#textctws').val();
  var fexam = $('#textfexam').val();
  var cexam = $('#textcexam').val();
  var suggestion = $('#textsuggestion').val();
  (async () => {
    await suggestInsAjax(words_id, ftws, ctws, fexam, cexam, suggestion);
  })()
  $('#confirmModal').css('display', 'none');
  $('#suggestModal').css('display', 'none');
}

$("#keyword").keypress(function(e) {
    if(e.keyCode == 13) {
      initWords($('#currlang').val(), $('#currcate').val(), $('#keyword').val());   
    }
});

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
*/
