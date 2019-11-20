const domain = 'http://localhost';

function logoutModal(){
	$('#logoutModal').modal('toggle');
}

function logoutConfirm(){
	window.location.href="/manage/logout";
}

// formatDatetoISOString function
function formatDateTime(data, type) {
  let dt = new Date(data);
	let date = dt.getDate();
	let month = dt.getMonth() + 1;
	let year = dt.getFullYear();
	let hour = dt.getHours();
	let minute = dt.getMinutes();
	let second = dt.getSeconds();

	// Add 0 before date, month, hour, minute, second if they are less than 0
	date = date < 10 ? '0' + date : date;
	month = month < 10 ? '0' + month : month;
	hour = hour < 10 ? '0' + hour : hour;
	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;

	if (type == 'date')
		dt = year + '-' + month + '-' +  date;
	else if (type == 'time')
		dt = hour + ':' + minute + ':' + second;
	else if (type == 'dt')
		dt = year + '-' + month + '-' +  date + ' ' + hour + ':' + minute + ':' + second;

    return dt;
}

// Initialize tinyMCE
function initTinymce() {
	tinymce.init({
		selector: '.editor',
		height: '300px',
		plugins: [
			'advlist autolink lists link image charmap print preview hr anchor pagebreak',
			'searchreplace wordcount visualblocks visualchars code fullscreen',
			'insertdatetime media nonbreaking save table directionality',
			'emoticons template paste textpattern imagetools codesample toc'
		],
		toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | forecolor backcolor | link unlink | fontsizeselect',
		menubar: 'false',
		fontsize_formats: "10px 12px 14px 18px 20px 24px 28px 36px",
		image_advtab: true,
		templates: [
			{ title: 'Test template 1', content: 'Test 1' },
			{ title: 'Test template 2', content: 'Test 2' }
		],
		content_css: [
			'//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
			'//www.tinymce.com/css/codepen.min.css'
		],
		language: 'zh_TW',
		language_url : '/dashboard/languages/zh_TW.js'
	});
}