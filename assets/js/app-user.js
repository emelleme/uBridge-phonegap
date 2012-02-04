$(function(){	

	$.storage = new $.store();
	var data = $.storage.get('PData');
	
	data = JSON.parse(data);
	var fullname = data.fullName;
	$('#success h2 span').html(fullname);

});
