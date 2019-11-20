$(document).ready(function(){
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
            <input class="cell1" type="button" value="${result[i+j].cate}" id="${result[i+j].cate_id}" onclick="chooseCate(this.id, this.value)">
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

    let result = await getWordsAjax(lang, cate, keyword, blurSearch, pages);

    let page = Math.ceil(parseInt(result[0][0]['COUNT(*)'], 10)/50);
    $('#page1').html('');
    for(var i=1;i<=page;i++){
      $('#page1').append(`
        <option value="${i}">${i}</option>
      `);
    }
    if(pages) $('#page1').val(pages);

    $('#title-p').html('');
    $('#title-p').append(`主題：${$('#currcate').val()}，&nbsp;共 ${result[0][0]['COUNT(*)']} 筆`);

    var tmp = '';
    for(var i=0;i < result[1].length;i++){
      if(i%2==0){
        tmp = `${tmp}<div style="background-color: #f1f5f6">`
      }else{
        tmp = `${tmp}<div style="background-color: white">`
      }
      tmp = `
        ${tmp}
        <table class="ltable">
          <tr>
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
              初級
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
  (async () => {
    let result = await getSuggestAjax();

    var tmp = '';
    var dateObj, month, day, year, newdate, tmpFeedback;
    for(var i=0;i < result.length;i++){
      newdate = result[i].time.substr(0, 10);
      if(result[i].admin_feedback==""){
        tmpFeedback = `<p>審查中</p>`;
      }else{
        tmpFeedback = `<p class="btn2" onclick="showFeedback(this)" data-result="${result[i].admin_feedback}">審查完成</p>`
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
              ${result[i].ftws}
            </td>
            <td class="scol4">
              ${result[i].fexam}
            </td>
            <td rowspan = "2" class="scol5">
              <p>初級</p>
            </td>
            <td rowspan = "2" class="scol6">
              ${result[i].suggestion}
            </td>
            <td rowspan = "2" class="scol7">
              ${result[i].user}
            </td>
            <td rowspan = "2" class="scol8">
              ${tmpFeedback}
            </td>
          </tr>
          <tr>
            <td class="scol3">
              ${result[i].ctws}
            </td>
            <td class="scol4">
              ${result[i].cexam}
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

async function getWordsAjax(lang, cate, keyword, blurSearch, pages) {
  let result;
  let data = {lang: lang, cate: cate, keyword: keyword, blurSearch: blurSearch, pages: pages};
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

async function getSuggestAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newSentence/getSuggest',
      type: 'GET'
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
  window.open("http://localhost:3030/newSentence/download/<%=deflang%>+<%=defcate%>");
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


