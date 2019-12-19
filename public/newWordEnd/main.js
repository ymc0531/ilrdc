$(document).ready(function(){
  $('#btn0').css('background-color', '#ACACAC');
  $('#0').css('display', 'block');
  $('#a-o-family').val('阿美');
  
  sidebarToggle();

  $('.confirm-btn').click(function(){
    $('#confirmModal').css('display', 'flex');
  });

  //test();
})

pageSetting();
initYear();

function test() {
  $('#1').css('display', 'none');
  $('#2').css('display', 'block');
}

function initAll() {
  initFeWord();
  initLcWord();
  initArticle();
  initFeReview();
  initArReview();
  initSuggest();
  initEthnicity();
  initOperator();
  initArName();
  initArName1();
}

function pageSetting() {
  (async () => {
    let fpage = 6;
    let res = await getPrivilegeAjax();
    if(res[0].nwp_status<10) {
      $('#btn0').css('display', 'none');
      $('#0').html('');
      $('#btn6').css('display', 'none');
      $('#6').html('');

      if(res[0].c_article==1) {
        fpage = 5;
        $('#year-5').html(`<option>${res[0].ca_year}</option>`);
      }
      else {
        $('#btn5').css('display', 'none');
        $('#5').html('');
      }

      if(res[0].c_word==1) {
        fpage = 4;
        $('#year-4').html(`<option>${res[0].cw_year}</option>`);
      }
      else {
        $('#btn4').css('display', 'none');
        $('#4').html('');
      }

      if(res[0].n_article==1) {
        fpage = 3;
        $('#year-3').html(`<option>${res[0].na_year}</option>`);
      }
      else {
        $('#btn3').css('display', 'none');
        $('#3').html('');
      }

      if(res[0].p_word==1) {
        fpage = 2;
        $('#year-2').html(`<option>${res[0].pw_year}</option>`);
      }
      else {
        $('#btn2').css('display', 'none');
        $('#2').html('');
      }

      if(res[0].n_word==1) {
        fpage = 1;
        $('#year-1').html(`<option>${res[0].nw_year}</option>`);
      }
      else {
        $('#btn1').css('display', 'none');
        $('#1').html('');
      }

      document.getElementById(`btn${fpage}`).click();
    }
    setTimeout(function() {
      initAll();
    }, 500);
  })()
}

async function getPrivilegeAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/privilege',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initYear() {
  let year = new Date().getFullYear() - 1911;
  for(let i=year;i>=103;i--) {
    $('#year-1').append(`<option>${i}</option>`);
    $('#year-2').append(`<option>${i}</option>`);
    $('#year-3').append(`<option>${i}</option>`);
    $('#year-4').append(`<option>${i}</option>`);
    $('#year-5').append(`<option>${i}</option>`);
  }
}

function initArName() {
  let year = $('#year-3').val();
  let data = {year: year};
  (async () => {
    let result = await getArNameAjax(data);
    $('#s-article').html('');
    for(let i=0;i<result.length;i++) {
      $('#s-article').append(`<option>${result[i].name}</option>`);
    }
  })()
}

function initArName1() {
  let year = $('#year-5').val();
  let data = {year: year};
  (async () => {
    let result = await getArNameAjax(data);
    $('#s-article-1').html('');
    for(let i=0;i<result.length;i++) {
      $('#s-article-1').append(`<option>${result[i].name}</option>`);
    }
  })()
}

async function getArNameAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/articlesName',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function changeStatus(t) {
  let id = $(t).parent().parent().attr('data-id');
  let col = $(t).prop('class');
  let status = $(t).prop('checked');
  let data = {id: id, col: col, status: status};
  (async () => {
    await changeStatusAjax(data);
  })()
}

async function changeStatusAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/nwStatus',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function changeYears(t) {
  let id = $(t).parent().parent().attr('data-id');
  let col = $(t).prop('class');
  let year = $(t).val();
  let data = {id: id, col: col, year: year};
  (async () => {
    await changeYearAjax(data);
  })()
}

async function changeYearAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/nwYear',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initOperator() {
  let bgColor;
  let years = '';
  let year = new Date().getFullYear()-1911;
  for(let i=year;i>=103;i--) {
    years = `${years}<option value="${i}">${i}</option>`;
  }
  (async () => {
    let res = await getOperatorAjax();
    $('#optrTable').html('');
    for(let i=0;i<res.length;i++) {
      if(i%2==1)
        bgColor = 'white';
      else
        bgColor = 'grey';
      $('#optrTable').append(`
        <tr id="tr-${i}" data-id="${res[i].id}">
          <td class="${bgColor}" style="width: 3%">
            <input type="checkbox" class="nwp_status" onchange="changeStatus(this)">
          </td>
          <td class="${bgColor}" style="width: 10%">${res[i].dialect_zh}</td>
          <td class="${bgColor}" style="width: 10%">${res[i].identity_num}</td>
          <td class="${bgColor}" style="width: 7%">${res[i].name_zh}</td>
          <td class="${bgColor}" style="width: 10%">${res[i].office_no}</td>
          <td class="${bgColor}" style="width: 10%">
            <input type="checkbox" class="n_word" onchange="changeStatus(this)">
            <select class="nw_year" onchange="changeYears(this)">
              ${years}
            </select>
          </td>
          <td class="${bgColor}" style="width: 10%">
            <input type="checkbox" class="n_article" onchange="changeStatus(this)">
            <select class="na_year" onchange="changeYears(this)">
              ${years}
            </select>
          </td>
          <td class="${bgColor}" style="width: 10%">
            <input type="checkbox" class="c_word" onchange="changeStatus(this)">
            <select class="cw_year" onchange="changeYears(this)">
              ${years}
            </select>
          </td>
          <td class="${bgColor}" style="width: 10%">
            <input type="checkbox" class="c_article" onchange="changeStatus(this)">
            <select class="ca_year" onchange="changeYears(this)">
              ${years}
            </select>
          </td>
          <td class="${bgColor}" style="width: 10%">
            <input type="checkbox" class="p_word" onchange="changeStatus(this)">
            <select class="pw_year" onchange="changeYears(this)">
              ${years}
            </select>
          </td>
          <td class="${bgColor}" style="width: 10%">
            <input type="checkbox" class="p_article" onchange="changeStatus(this)">
            <select class="pa_year" onchange="changeYears(this)">
              ${years}
            </select>
          </td>
        </tr>
      `);
        $(`#tr-${i}`).find('.nwp_status').prop('checked', res[i].nwp_status);
      waitForEx($(`#tr-${i}`).find('.na_year').html(), function() {
        $(`#tr-${i}`).find('.n_word').prop('checked', res[i].n_word);
        $(`#tr-${i}`).find('.nw_year').val(res[i].nw_year);
        $(`#tr-${i}`).find('.n_article').prop('checked', res[i].n_article);
        $(`#tr-${i}`).find('.na_year').val(res[i].na_year);
      });
      waitForEx($(`#tr-${i}`).find('.ca_year').html(), function() {
        $(`#tr-${i}`).find('.c_word').prop('checked', res[i].c_word);
        $(`#tr-${i}`).find('.cw_year').val(res[i].cw_year);
        $(`#tr-${i}`).find('.c_article').prop('checked', res[i].c_article);
        $(`#tr-${i}`).find('.ca_year').val(res[i].ca_year);
      });
      waitForEx($(`#tr-${i}`).find('.pa_year').html(), function() {  
        $(`#tr-${i}`).find('.p_word').prop('checked', res[i].p_word);
        $(`#tr-${i}`).find('.pw_year').val(res[i].pw_year);
        $(`#tr-${i}`).find('.p_article').prop('checked', res[i].p_article);
        $(`#tr-${i}`).find('.pa_year').val(res[i].pa_year);
      });
    }
  })()
}

async function getOperatorAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/operator',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initEthnicity() {
  (async () => {
    let res = await getEthnicityAjax();
    for(let i=0;i<res.length;i++) {
      $('#aoEthnicity').append(`<option value='${res[i].id}'>${res[i].ethnicity}</option>`);
    }
  })()
}

async function getEthnicityAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/ethnicity',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initDialect() {
  let data = {id: $('#aoEthnicity').val()};
  $('#aoDialect').html(`<option value=''>方言(全選)</option>`);
  (async () => {
    let res = await getDialectAjax(data);
    for(let i=0;i<res.length;i++) {
      $('#aoDialect').append(`<option value='${res[i].id}'>${res[i].dialect_zh}</option>`);
    }
  })()
}

async function getDialectAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/dialect',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function operatorSearch() {
  let ethnicity = $('#aoEthnicity').val();
  let dialect = $('#aoDialect').val();
  let keyword = $('#operatorSearch').val();
  let data = {ethnicity: ethnicity, dialect: dialect, keyword: keyword};
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
            <p class="nm">${result[i].dialect_zh}</p>
          </td>
          <td style="width: 20%">
            <p class="nm">${result[i].current_addr}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[i].tribe_zh}</p>
          </td>
          <td style="width: 15%">
            <button class="btn3" onclick="confirmApplyOpp('${result[i].id}')">確認</button>
          </td>
        </tr>
      `);
    }
  })()
}

async function searchOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/searchOperator',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function confirmApplyOpp(id) {
  let data = {id: id};
  (async () => {
    await insOperatorAjax(data);
  })()
}

async function insOperatorAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/insOperator',
      type: 'PUT',
      data: data,
      statusCode: {
        200: function() {
          initOperator();
          closeModal('applyOperatorModal');
        },
        400: function() {
          alert('此帳號已存在。');
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initFeReview() {
  let check, str, isAudio, isAudioEx;
  let year = $('#year-4').val();
  let page = $('#pages-4').val();
  if(!page) page = 1;
  let data = {year: year, page: page};
  (async () => {
    let audioFile = await getAudioFileAjax();
    let result = await getFeReviewsAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-4').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-4').append(`<option>${i}</option>`);
    }
    $('#pages-4').val(page);

    $('#4 .workTable-edit').html('');    
    for(let i=0;i<result[1].length;i++){
      isAudio = '';
      isAudioEx = '';
      if(audioFile.find(x => x == `word-${result[1][i].id}.wav`)) {
        isAudio = `<i class="material-icons edit-icon" onclick="playAudio('word-${result[1][i].id}.wav')">volume_up</i>`;
      }
      if(audioFile.find(x => x == `ex-${result[1][i].id}.wav`)){
        isAudioEx = `<i class="material-icons edit-icon" onclick="playAudio('ex-${result[1][i].id}.wav')">volume_up</i>`;
      }
      check = 0;
      if(result[1][i].a1&&result[1][i].a1!='') check++;
      if(result[1][i].a2&&result[1][i].a2!='') check++;
      if(result[1][i].a3&&result[1][i].a3!='') check++;
      if(result[1][i].a4&&result[1][i].a4!='') check++;
      if(result[1][i].a5&&result[1][i].a5!='') check++;
      if(result[1][i].a6&&result[1][i].a6!='') check++;
      if(result[1][i].a7&&result[1][i].a7!='') check++;
      check = Math.ceil((100/7)*check);
      if(check>99) str = `<p class="nm green">已完成</p>`;
      else str = `<p class="nm red">未完成 ${check}%</p>`;
      $('#4 .workTable-edit').append(`
        <tr>
          <td style="width: 2%">
            <p class="nm">${i+1}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].cate}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].subcate}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].dialect}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].ab}</p>
          </td>
          <td style="width: 5%">
            ${isAudio}
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].ch}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].mean}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].description}</p>
          </td>
          <td style="width: 5%">
            ${isAudioEx}
          </td>
          <td style="width: 5%">
            <i class="material-icons edit-icon" onclick="editFeReview(${result[1][i].id})">border_color</i>
          </td>
          <td style="width: 10%">
            ${str}
          </td>
          <td style="width: 5%">
            <input type="checkbox" value="1" onclick="approve(this, ${result[1][i].id}, ${check})">
          </td>
        </tr>
      `);
    }
  })()
}

async function getFeReviewsAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/feReviews',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initFeWord() {
  let isAudio, isAudioEx;
  let year = $('#year-1').val();
  let page = $('#pages-1').val();
  if(!page) page = 1;
  let data = {year: year, page: page};
  (async () => {
    let audioFile = await getAudioFileAjax();
    let result = await getFeWordsAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-1').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-1').append(`<option>${i}</option>`);
    }
    $('#pages-1').val(page);

    $('#1 .workTable-edit').html('');    
    for(let i=0;i<result[1].length;i++){
      isAudio = '';
      isAudioEx = '';
      if(audioFile.find(x => x == `word-${result[1][i].id}.wav`)) {
        isAudio = `<i class="material-icons edit-icon" onclick="playAudio('word-${result[1][i].id}.wav')">volume_up</i>`;
      }
      if(audioFile.find(x => x == `ex-${result[1][i].id}.wav`)){
        isAudioEx = `<i class="material-icons edit-icon" onclick="playAudio('ex-${result[1][i].id}.wav')">volume_up</i>`;
      }
      $('#1 .workTable-edit').append(`
        <tr>
          <td style="width: 2%">
            <p class="nm">${i+1}</p>
          </td>
          <td style="width: 6%">
            <p class="nm">${result[1][i].cate}</p>
          </td>
          <td style="width: 8%">
            <p class="nm">${result[1][i].subcate}</p>
          </td>
          <td style="width: 6%">
            <p class="nm">${result[1][i].dialect}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].ab}</p>
          </td>
          <td style="width: 3%">
            ${isAudio}
          </td>
          <td style="width: 8%">
            <p class="nm">${result[1][i].ch}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].mean}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].description}</p>
          </td>
          <td style="width: 8%">
            <p class="nm">${result[1][i].word_formation}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${result[1][i].ab_example}</p>
            <p class="nm">${result[1][i].ch_example}</p>
          </td>
          <td style="width: 3%">
            ${isAudioEx}
          </td>
          <td style="width: 5%">
            <p class="nm">${result[1][i].example_type}</p>
          </td>
          <td style="width: 8%">
            <p class="nm">${result[1][i].remark}</p>
          </td>
          <td style="width: 3%">
            <i class="material-icons edit-icon" onclick="editFeWord(${result[1][i].id})">border_color</i>
          </td>
        </tr>
      `);
    }
  })()
}

async function getFeWordsAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/feWords',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function approve(val, id, check) {
  if(check>99){
    let checked = 0;
    if($(val).prop('checked')) checked = 1;
    let data = {id: id, checked: checked};
    (async () => {
      let result = await changeWordStatusAjax(data);
      if(!result) {
        $(val).prop('checked', false);
        alert('無權限使用此功能。');
      }
    })()
  }else{
    $(val).prop('checked', false);
    alert('審查未完成！');
  }
}

async function changeWordStatusAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/changeWordStatus',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editFeReview(id) {
  let data = {id: id};
  let data1 = {name: `word-${id}`};
  let data2 = {name: `ex-${id}`};
  (async () => {
    let audio = await getAudioAjax(data1);
    let audioEx = await getAudioAjax(data2);
    let result = await getFeReviewAjax(data);
    console.log(result);
    $('#fer-id').attr('data-id', result[0].id);
    $('#fer-id').html(result[0].id);
    $('#fer-season').html(result[0].season);
    $('#fer-language').html(result[0].language);
    $('#fer-dialect').html(result[0].dialect);
    $('#fer-cate').html(result[0].cate);
    $('#fer-subcate').html(result[0].subcate);
    $('#fer-ch').html(result[0].ch);
    $('#fer-ab').html(result[0].ab);
    $('#fer-mean').html(result[0].mean);
    $('#fer-description').html(result[0].description);
    $('#fer-word_formation').html(result[0].word_formation);
    $('#fer-ab_example').html(result[0].ab_example);
    $('#fer-ch_example').html(result[0].ch_example);
    $('#fer-example_type').html(result[0].example_type);
    $('#fer-remark').html(result[0].remark);
    $('#a1').val(result[0].a1);
    $('#a2').val(result[0].a2);
    $('#a3').val(result[0].a3);
    $('#a4').val(result[0].a4);
    $('#a5').val(result[0].a5);
    $('#a6').val(result[0].a6);
    $('#a7').val(result[0].a7);
    $('#4 .arAudio-btn').html('');
    if(audio&&audio!='') {
      audio = `/audio/newWord/${audio}`;
      $('#4 .arAudio-btn').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audio}')">volume_up</i>`);
    }
    $('#4 .arAudio-btn-ex').html('');
    if(audioEx&&audioEx!='') {
      audioEx = `/audio/newWord/${audioEx}`;
      $('#4 .arAudio-btn-ex').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audioEx}')">volume_up</i>`);
    }
    showPage(4,2);
  })()
}

async function getFeReviewAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/feReview',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editFeWord(id) {
  let data = {id: id};
  let data1 = {name: `word-${id}`};
  let data2 = {name: `ex-${id}`};
  (async () => {
    let audio = await getAudioAjax(data1);
    let audioEx = await getAudioAjax(data2);
    let result = await getFeWordAjax(data);
    $('#fe-ch').attr('data-id', result[0].id);
    $('#fe-ch').html(result[0].ch);
    $('#fe-cate').html(result[0].cate);
    $('#fe-subcate').html(result[0].subcate);
    $('#fe-dialect').html(result[0].dialect);
    $('#fe-ab').val(result[0].ab);
    $('#fe-mean').val(result[0].mean);
    $('#fe-description').val(result[0].description);
    $('#fe-word_formation').val(result[0].word_formation);
    $('#fe-ab_example').val(result[0].ab_example);
    $('#fe-ch_example').val(result[0].ch_example);
    $('#fe-example_type').val(result[0].example_type);
    $('#fe-remark').val(result[0].remark);
    $('#1 .arAudio-btn').html('');
    if(audio&&audio!='') {
      audio = `/audio/newWord/${audio}`;
      $('#1 .arAudio-btn').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audio}')">volume_up</i>`);
    }
    $('#1 .arAudio-btn-ex').html('');
    if(audioEx&&audioEx!='') {
      audioEx = `/audio/newWord/${audioEx}`;
      $('#1 .arAudio-btn-ex').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audioEx}')">volume_up</i>`);
    }
    showPage(1,2);
  })()
}

async function getFeWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/feWord',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initLcWord() {
  let isAudio, isAudioEx;
  let year = $('#year-2').val();
  let page = $('#pages-2').val();
  if(!page) page = 1;
  let data = {year: year, page: page};
  (async () => {
    let audioFile = await getAudioFileAjax();
    let result = await getLcWordsAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-2').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-2').append(`<option>${i}</option>`);
    }
    $('#pages-2').val(page);

    $('#2 .workTable-edit').html('');    
    for(let i=0;i<result[1].length;i++){
      isAudio = '';
      isAudioEx = '';
      if(audioFile.find(x => x == `word-${result[1][i].id}.wav`)) {
        isAudio = `<i class="material-icons edit-icon" onclick="playAudio('word-${result[1][i].id}.wav')">volume_up</i>`;
      }
      if(audioFile.find(x => x == `ex-${result[1][i].id}.wav`)){
        isAudioEx = `<i class="material-icons edit-icon" onclick="playAudio('ex-${result[1][i].id}.wav')">volume_up</i>`;
      }
      $('#2 .workTable-edit').append(`
        <tr>
          <td style="width: 2%">
              <p class="nm">${i+1}</p>
            </td>
            <td style="width: 6%">
              <p class="nm">${result[1][i].cate}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].subcate}</p>
            </td>
            <td style="width: 6%">
              <p class="nm">${result[1][i].dialect}</p>
            </td>
            <td style="width: 10%">
              <p class="nm">${result[1][i].ab}</p>
            </td>
            <td style="width: 3%">
              ${isAudio}
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].ch}</p>
            </td>
            <td style="width: 10%">
              <p class="nm">${result[1][i].mean}</p>
            </td>
            <td style="width: 10%">
              <p class="nm">${result[1][i].description}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].word_formation}</p>
            </td>
            <td style="width: 10%">
              <p class="nm">${result[1][i].ab_example}</p>
              <p class="nm">${result[1][i].ch_example}</p>
            </td>
            <td style="width: 3%">
              ${isAudioEx}
            </td>
            <td style="width: 5%">
              <p class="nm">${result[1][i].example_type}</p>
            </td>
            <td style="width: 8%">
              <p class="nm">${result[1][i].remark}</p>
            </td>
            <td style="width: 3%">
              <i class="material-icons edit-icon" onclick="editLcWord(${result[1][i].id})">border_color</i>
            </td>
        </tr>
      `);
    }
  })()
}

async function getLcWordsAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/lcWords',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editLcWord(id) {
  let data = {id: id};
  let data1 = {name: `word-${id}`};
  let data2 = {name: `ex-${id}`};
  (async () => {
    let audio = await getAudioAjax(data1);
    let audioEx = await getAudioAjax(data2);
    let result = await getLcWordAjax(data);
    $('#lc-ch').attr('data-id', result[0].id);
    $('#lc-ch').html(result[0].ch);
    $('#lc-cate').html(result[0].cate);
    $('#lc-subcate').html(result[0].subcate);
    $('#lc-dialect').html(result[0].dialect);
    $('#lc-ab').val(result[0].ab);
    $('#lc-mean').val(result[0].mean);
    $('#lc-description').val(result[0].description);
    $('#lc-word_formation').val(result[0].word_formation);
    $('#lc-ab_example').val(result[0].ab_example);
    $('#lc-ch_example').val(result[0].ch_example);
    $('#lc-example_type').val(result[0].example_type);
    $('#lc-remark').val(result[0].remark);
    $('#2 .arAudio-btn').html('');
    if(audio&&audio!='') {
      audio = `/audio/newWord/${audio}`;
      $('#2 .arAudio-btn').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audio}')">volume_up</i>`);
    }
    $('#2 .arAudio-btn-ex').html('');
    if(audioEx&&audioEx!='') {
      audioEx = `/audio/newWord/${audioEx}`;
      $('#2 .arAudio-btn-ex').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audioEx}')">volume_up</i>`);
    }
    showPage(2,2);
  })()
}

async function getLcWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/lcWord',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initArticle() {
  let isAudio;
  let year = $('#year-3').val();
  let page = $('#pages-3').val();
  let selector = document.getElementById('s-article');
  waitForEl(selector, function() {
    let name = $('#s-article').val();
    if(!page) page = 1;
    let data = {year: year, page: page, name: name};
    (async () => {
      let audioFile = await getAudioFileAjax();
      let result = await getArticlesAjax(data);
      let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

      $('#pages-3').html('');
      for(let i=1;i<=tpage;i++){
        $('#pages-3').append(`<option>${i}</option>`);
      }
      $('#pages-3').val(page);

      $('#3 .workTable-edit-1').html('');    
      for(let i=0;i<result[1].length;i++){
        isAudio = '';
        if(audioFile.find(x => x == `ar-${result[1][i].id}.wav`)) {
          isAudio = `<i class="material-icons edit-icon" onclick="playAudio('ar-${result[1][i].id}.wav')">volume_up</i>`;
        }
        $('#3 .workTable-edit-1').append(`
          <tr class="wt-row">
            <td style="width: 5%">
              <p class="nm">${result[1][i].sid}</p>
            </td>
            <td style="width: 5%">
              <p class="nm">${result[1][i].paragraph}</p>
            </td>
            <td style="width: 40%" class="wt-col">
              <p class="nm">${result[1][i].ch_content}</p>
            </td>
            <td style="width: 40%" class="wt-col">
              <p class="nm">${result[1][i].ab_content}</p>
            </td>
            <td style="width: 5%">
              ${isAudio}
            </td>
            <td style="width: 5%">
              <i class="material-icons edit-icon" onclick="editArticle(${result[1][i].id})">border_color</i>
            </td>
          </tr>
        `);
      }
    })()
  })
}

async function getArticlesAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/articles',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editArticle(id) {
  let data = {id: id};
  let data1 = {name: `ar-${id}`};
  (async () => {
    let audio = await getAudioAjax(data1);
    let result = await getArticleAjax(data);
    $('#ar-sid').attr('data-id', result[0].id);
    $('#ar-sid').html(result[0].sid);
    $('#ar-paragraph').html(result[0].paragraph);
    $('#ar-dialect').html(result[0].dialect);
    $('#ar-ch_content').val(result[0].ch_content);
    $('#ar-ab_content').val(result[0].ab_content);
    let ch_keyword = result[0].ch_keyword.split('*');
    let ab_keyword = result[0].ab_keyword.split('*');
    for(let i=ab_keyword.length;i<ch_keyword.length;i++) {
      ab_keyword.push('');
    }
    $('.kw-table-content').html('');
    if(ch_keyword!='') {
      for(let i=0;i<ch_keyword.length;i++) {
        $('.kw-table-content').append(`
          <tr>
            <td>
              ${ch_keyword[i]}
            </td>
            <td>
              <textarea class="kw-ta" name="ab_keyword[]">${ab_keyword[i]}</textarea>
            </td>
          </tr>
        `);
      }
    }
    $('#3 .arAudio-btn').html('');
    if(audio&&audio!='') {
      audio = `/audio/newWord/${audio}`;
      $('#3 .arAudio-btn').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audio}')">volume_up</i>`);
    }
    showPage(3,2);
  })()
}

function playArAudio(file) {
  console.log(file);
  $('#arAudio').find('source').prop('src', file);
  x = document.getElementById('arAudio');
  x.load();
  x.play();
}

async function getAudioAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/file',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getAudioFileAjax() {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/files',
      type: 'GET'
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getArticleAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/article',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function initArReview() {
  let check, str, checkbox, isAudio;
  let year = $('#year-5').val();
  let page = $('#pages-5').val();
  let selector = document.getElementById('s-article-1');
  waitForEl(selector, function() {
    let name = $('#s-article-1').val();
    if(!page) page = 1;
    let data = {year: year, page: page, name: name};
    (async () => {
      let audioFile = await getAudioFileAjax();
      let result = await getArReviewsAjax(data);
      let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

      $('#pages-5').html('');
      for(let i=1;i<=tpage;i++){
        $('#pages-5').append(`<option>${i}</option>`);
      }
      $('#pages-5').val(page);

      $('#5 .workTable-edit-1').html('');    
      for(let i=0;i<result[1].length;i++){
        isAudio = '';
        if(audioFile.find(x => x == `ar-${result[1][i].id}.wav`)) {
          isAudio = `<i class="material-icons edit-icon" onclick="playAudio('ar-${result[1][i].id}.wav')">volume_up</i>`;
        }
        check = 0;
        if(result[1][i].a1&&result[1][i].a1!='') check++;
        //check = Math.ceil((100/7)*check);
        if(check>0) str = `<p class="nm green" name="checkdone[]">已完成</p>`;
        else str = `<p class="nm red" name="checkdone[]">未完成 0%</p>`;
        if(i==0) checkbox = `<input type="checkbox" value="1" onclick="arApprove(this, '${result[1][i].name}')">`
        else checkbox = '';
        $('#5 .workTable-edit-1').append(`
          <tr class="wt-row">
            <td style="width: 5%">
              <p class="nm">${result[1][i].sid}</p>
            </td>
            <td style="width: 5%">
              <p class="nm">${result[1][i].paragraph}</p>
            </td>
            <td style="width: 32%" class="wt-col">
              <p class="nm">${result[1][i].ch_content}</p>
            </td>
            <td style="width: 32%" class="wt-col">
              <p class="nm">${result[1][i].ab_content}</p>
            </td>
            <td style="width: 5%">
              ${isAudio}
            </td>
            <td style="width: 5%">
              <i class="material-icons edit-icon" onclick="editArReview(${result[1][i].id})">border_color</i>
            </td>
            <td style="width: 10%">
              ${str}
            </td>
            <td style="width: 6%">
              ${checkbox}
            </td>
          </tr>
        `);
      }
    })()
  })
}

async function getArReviewsAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/arReviews',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editArReview(id) {
  let data = {id: id};
  let data1 = {name: `ar-${id}`};
  (async () => {
    let audio = await getAudioAjax(data1);
    let result = await getArReviewAjax(data);
    $('#arr-id').attr('data-id', result[0].id);
    $('#arr-id').html(result[0].id);
    $('#arr-season').html(result[0].season);
    $('#arr-language').html(result[0].language);
    $('#arr-dialect').html(result[0].dialect);
    $('#arr-name').html(result[0].name);
    $('#arr-cate').html(result[0].cate);
    $('#arr-sid').html(result[0].sid);
    $('#arr-paragraph').html(result[0].paragraph);
    $('#arr-ch').html(result[0].ch_content);
    $('#arr-ab').html(result[0].ab_content);
    $('#arr-a1').val(result[0].a1);
    $('#5 .arAudio-btn').html('');
    if(audio&&audio!='') {
      audio = `/audio/newWord/${audio}`;
      $('#5 .arAudio-btn').html(`<i class="material-icons edit-icon-1" onclick="playArAudio('${audio}')">volume_up</i>`);
    }
    showPage(5,2);
  })()
}

async function getArReviewAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/arReview',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function arApprove(val, name) {
  let check = 1;
  let a = document.getElementsByName('checkdone[]');
  for(let i=0;i<a.length;i++){
    if($(a[i]).html()!='已完成') check = 0;
  }
  if(check>0){
    let checked = 0;
    if($(val).prop('checked')) checked = 1;
    let data = {name: name, checked: checked};
    (async () => {
      await changeArticleStatusAjax(data);
    })()
  }else{
    $(val).prop('checked', false);
    alert('審查未完成！');
  }
}

async function changeArticleStatusAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/changeArticleStatus',
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
  let time;
  let page = $('#pages-6').val();
  if(!page) page = 1;
  let data = {page: page};
  (async () => {
    let result = await getSuggestAjax(data);
    let tpage = Math.ceil(result[0][0]['COUNT(*)']/50);

    $('#pages-6').html('');
    for(let i=1;i<=tpage;i++){
      $('#pages-6').append(`<option>${i}</option>`);
    }
    $('#pages-6').val(page);

    $('#6 .workTable-edit').html('');    
    for(let i=0;i<result[1].length;i++){
      time = result[1][i].create_time.substr(0, 10);
      $('#6 .workTable-edit').append(`
        <tr>
          <td style="width: 4%">
            <p class="nm">${i+1}</p>
          </td>
          <td style="width: 10%">
            <p class="nm">${time}</p>
          </td>
          <td style="width: 5%">
            <p class="nm">${result[1][i].event}</p>
          </td>
          <td style="width: 5%">
            <p class="nm">${result[1][i].cate}</p>
          </td>
          <td style="width: 5%">
            <p class="nm">${result[1][i].subcate}</p>
          </td>
          <td style="width: 5%">
            <p class="nm">${result[1][i].season}</p>
          </td>
          <td style="width: 5%">
            <p class="nm">${result[1][i].dialect}</p>
          </td>
          <td style="width: 14%">
            <p class="nm">${result[1][i].ab}</p>
          </td>
          <td style="width: 12%">
            <p class="nm">${result[1][i].ch}</p>
          </td>
          <td style="width: 12%">
            <p class="nm">${result[1][i].suggestion}</p>
          </td>
          <td style="width: 6%">
            <p class="nm">${result[1][i].username}</p>
          </td>
          <td class="feedback" style="width: 12%">
            <textarea class="nm2">${result[1][i].feedback}</textarea>
          </td>
          <td style="width: 5%">
            <button class="confirm-btn" onclick="feedbackSubmit(this, ${result[1][i].id})">確認</button>
          </td>
        </tr>
      `);
    }
  })()
}

async function getSuggestAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/suggest',
      type: 'POST',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function changeYear(num) {
  switch(num) {
    case 1:
      initFeWord();
      break;
    case 2:
      initLcWord();
      break;
    case 3:
      initArName();
      initArticle();
      break;
    case 4:
      initFeReview();
      break;
    case 5:
      initArName1();
      initArReview();
      break;
  }
}

function changepage(num) {
  switch(num) {
    case 1:
      initFeWord();
      break;
    case 2:
      initLcWord();
      break;
    case 3:
      initArticle();
      break;
    case 4:
      initFeReview();
      break;
    case 5:
      initArReview();
      break;
  }
}

function prevpage(num) {
  let currpage = parseInt($(`#pages-${num}`).val(), 10);
  if(currpage>1){
    $(`#pages-${num}`).val(currpage-1);
    switch(num){
      case 1:
        initFeWord();
        break;
      case 2:
        initLcWord();
        break;
      case 3:
        initArticle();
        break;
      case 4:
        initFeReview();
        break;
      case 5:
        initArReview();
        break;
    }
  }
}
function nextpage(num) {
  let currpage = parseInt($(`#pages-${num}`).val(), 10);
  let maxpage = $(`#pages-${num}`).children().length;
  if(currpage < maxpage){
    $(`#pages-${num}`).val(currpage+1);
    switch(num){
      case 1:
        initFeWord();
        break;
      case 2:
        initLcWord();
        break;
      case 3:
        initArticle();
        break;
      case 4:
        initFeReview();
        break;
      case 5:
        initArReview();
        break;
    }
  }
}

function changeArticle(num) {
  switch(num) {
    case 1:
      initArticle();
      break;
    case 2:
      initArReview();
      break;
  }
}

function showPage(page, num) {
  let prev = $(`#${page} .page-title`).attr('data-act-page');
  $(`#${page} .btn${prev}`).removeClass('act-btn');
  $(`#${page} .btn${num}`).addClass('act-btn');
  $(`#${page} .page-title`).attr('data-act-page', `${num}`);
  $(`#${page} .page-${prev}`).css('display', 'none');
  $(`#${page} .page-${num}`).css('display', 'block');
}

function showConfirmModal(id) {
  $('#confirmModal').attr('data-id', id);
  $('#confirmModal').css('display', 'flex');
}

function modalConfirm() {
  let id = $('#confirmModal').attr('data-id');
  switch(id) {
    case '1':
      editFeSubmit();
      break;
    case '2':
      editLcSubmit();
      break;
    case '3':
      editArSubmit();
      break;
    case '4':
      editWrSubmit();
      break;
    case '5':
      editArrSubmit();
      break;
  }
  modalCancel();
}

function editFeSubmit() {
  let id = $('#fe-ch').attr('data-id');
  let ab = $('#fe-ab').val();
  let mean = $('#fe-mean').val();
  let description = $('#fe-description').val();
  let word_formation = $('#fe-word_formation').val();
  let ab_example = $('#fe-ab_example').val();
  let ch_example = $('#fe-ch_example').val();
  let example_type = $('#fe-example_type').val();
  let remark = $('#fe-remark').val();
  let data = {id: id, ab: ab, mean: mean, description: description, word_formation: word_formation, ab_example: ab_example, ch_example: ch_example, example_type: example_type, remark: remark};
  (async () => {
    let result = await editFeWordAjax(data);
    initFeWord();
  })()
}

async function editFeWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/feWord',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editLcSubmit() {
  let id = $('#lc-ch').attr('data-id');
  let ab = $('#lc-ab').val();
  let mean = $('#lc-mean').val();
  let description = $('#lc-description').val();
  let word_formation = $('#lc-word_formation').val();
  let ab_example = $('#lc-ab_example').val();
  let ch_example = $('#lc-ch_example').val();
  let example_type = $('#lc-example_type').val();
  let remark = $('#lc-remark').val();
  let data = {id: id, ab: ab, mean: mean, description: description, word_formation: word_formation, ab_example: ab_example, ch_example: ch_example, example_type: example_type, remark: remark};
  (async () => {
    let result = await editLcWordAjax(data);
    initLcWord();
  })()
}

async function editLcWordAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/lcWord',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editArSubmit() {
  let ab_keyword = '';
  let id = $('#ar-sid').attr('data-id');
  let ab_content = $('#ar-ab_content').val();
  let tmp = document.getElementsByName('ab_keyword[]');
  for(let i=0;i<tmp.length;i++) {
    ab_keyword = `${ab_keyword}${tmp[i].value}*`
  }
  let data = {id: id, ab_content: ab_content, ab_keyword: ab_keyword};

  (async () => {
    let result = await editArticleAjax(data);
    initArticle();
  })()
}

async function editArticleAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/article',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editArrSubmit() {
  let ab_keyword = '';
  let id = $('#arr-id').attr('data-id');
  let a1 = $('#arr-a1').val();
  let data = {id: id, a1: a1};

  (async () => {
    let result = await editArReviewAjax(data);
    initArReview();
  })()
}

async function editArReviewAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/arReview',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function editWrSubmit() {
  let id = $('#fer-id').attr('data-id');
  let a1 = $('#a1').val();
  let a2 = $('#a2').val();
  let a3 = $('#a3').val();
  let a4 = $('#a4').val();
  let a5 = $('#a5').val();
  let a6 = $('#a6').val();
  let a7 = $('#a7').val();
  let data = {id: id, a1: a1, a2: a2, a3: a3, a4: a4, a5: a5, a6: a6, a7:a7};

  (async () => {
    let result = await editWordReviewAjax(data);
    initFeReview();
  })()
}

async function editWordReviewAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/feReview',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function feedbackSubmit(val, id) {
  let feedback = $(val).parent().parent().find('.feedback').children('textarea').val();
  let data = {id: id, feedback: feedback};
  (async () => {
    await feedbackAjax(data);
    alert('確認回覆。');
  })()
}

async function feedbackAjax(data) {
  let result;
  try {
    result = await $.ajax({
      url: '/newWordEnd/feedback',
      type: 'PUT',
      data: data
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function modalCancel() {
  $('#confirmModal').attr('data-id', '');
  $('#confirmModal').css('display', 'none');
}

let waitForEl = function(selector, callback) {
  if (selector.length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

let waitForEx = function(selector, callback) {
  if (selector) {
    callback();
  } else {
    setTimeout(function() {
      waitForEx(selector, callback);
    }, 100);
  }
};

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
  $(`#${id}`).css('display', 'block');
}

function openModal(modal) {
  $(`#${modal}`).css('display', 'flex');
}

function closeModal(modal) {
  $(`#${modal}`).css('display', 'none');
}

function openRecorder(type) {
  switch(type) {
    case 'word':
      $('#recorderModal').attr('data-type', type);
      $('#recorderModal').attr('data-id', `${type}-${$('#fe-ch').attr('data-id')}`);
      break;
    case 'ex':
      $('#recorderModal').attr('data-type', type);
      $('#recorderModal').attr('data-id', `${type}-${$('#fe-ch').attr('data-id')}`);
      break;
    case 'word-2':
      $('#recorderModal').attr('data-type', type);
      $('#recorderModal').attr('data-id', `word-${$('#lc-ch').attr('data-id')}`);
      break;
    case 'ex-2':
      $('#recorderModal').attr('data-type', type);
      $('#recorderModal').attr('data-id', `ex-${$('#lc-ch').attr('data-id')}`);
      break;
    case 'ar':
      $('#recorderModal').attr('data-type', type);
      $('#recorderModal').attr('data-id', `${type}-${$('#ar-sid').attr('data-id')}`);
      break;
  }
  $('#recorderModal').css('display', 'flex');
}

function closeRecorder() {
  let type = $('#recorderModal').attr('data-type');
  switch(type) {
    case 'word':
      initFeWord();
      editFeWord(parseInt($('#fe-ch').attr('data-id'), 10));
      break;
    case 'ex':
      initFeWord();
      editFeWord(parseInt($('#fe-ch').attr('data-id'), 10));
      break;
    case 'word-2':
      initLcWord();
      editLcWord(parseInt($('#lc-ch').attr('data-id'), 10));
      break;
    case 'ex-2':
      initLcWord();
      editLcWord(parseInt($('#lc-ch').attr('data-id'), 10));
      break;
    case 'ar':
      initArticle();
      editArticle(parseInt($('#ar-sid').attr('data-id'), 10));
      break;
  }
  $('#recorderModal').attr('data-id', '');
  $('#recorderModal').css('display', 'none');
}

function playAudio(file) {
  let x = document.getElementById('arAudio');
  $('#arAudio').find('source').prop('src', `/audio/newWord/${file}`);
  x.load();
  x.play();
}


//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------

