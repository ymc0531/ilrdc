function sysManage () {
  window.location.href="/sysManage";
};

function proManage () {
  window.location.href="/proManage";
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