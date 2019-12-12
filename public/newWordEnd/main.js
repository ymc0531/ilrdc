$(document).ready(function(){
  $('#btn1').css('background-color', '#ACACAC');
  $('#1').css('display', 'block');
  $('#a-o-family').val('阿美');
  
  sidebarToggle();
  initFeWord();
  initLcWord();
  initArticle();
  initFeReview();
  initArReview();
  initSuggest();

  $('.confirm-btn').click(function(){
    $('#confirmModal').css('display', 'flex');
  });

  //test();
})

pageSetting();
initYear();
initArName();
initArName1();

function test() {
  $('#1').css('display', 'none');
  $('#2').css('display', 'block');
}

function pageSetting() {
  (async () => {
    let result = await getPrivilegeAjax();
    switch(result[0].privilege) {
      case 1:
        $('#btn1').css('display', 'none');
        $('#btn2').css('display', 'none');
        $('#btn3').css('display', 'none');
        $('#1').html('');
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
      await changeWordStatusAjax(data);
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
  }
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

/*
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
            <p class="nm">${result[i].last_edit}</p>
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
              <p class="nm">${result[i].tribe}</p>
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

let waitForAll = function(lang, cate, callback) {
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

*/