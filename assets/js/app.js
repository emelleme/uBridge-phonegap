$(function(){	
$("#next").bind( "click", function(e, ui) {

	e.stopImmediatePropagation();
	e.preventDefault();
	
	var phone = $('#phone').val();
	var fullName = $('#name').val();
	
	
	/* If phone is blank, create user */
	if(phone == ''){
		alert('You did not enter a phone number for verification, so you will not be able to receive uMessages. You can add your number from the settings menu once you login.');
		 
		return false;
	}
	
	$.jsonp({
		  "url": "https://api-microbridge.rhcloud.com/api/verifyPhone?callback=?",
		  "data": {
		      "phone":phone,
		      "fullName": fullName
		  },
		  "success": function(payload) {
		      // handle user profile here
		      $('.hero-unit').html();	
		      $.storage = new $.store();
		      $.storage.set( payload.pin, payload.pin );
		      $.storage.set( 'PData', JSON.stringify(payload) );
		      location.assign('verify.html');
		      //console.log(JSON.stringify(payload));
		  },
		  "error": function(d,msg) {
		      alert("Im Sorry, but there was an error communicating with the Phone Verification Server.");
		  }
	});
});

$("#check-code").bind( "click", function(e, ui) {

	e.stopImmediatePropagation();
	e.preventDefault();
	
	var pin = $('#pin').val();
	$.storage = new $.store();
	var phone = $.storage.get('phone')
	var data = $.storage.get('PData');
	data = JSON.parse(data);
	var phone = data.phone;
	
	/* If phone is blank, create user */
	if(phone == ''){
		alert('You did not enter a phone number for verification, so you will not be able to receive uMessages. You can add your number from the settings menu once you login.');
		 
		return false;
	}
	
	
	$.jsonp({
		  "url": "https://api-microbridge.rhcloud.com/api/verifyPin?callback=?",
		  "data": {
		      "phone":phone,
		      "pin":pin,
		      "a":data.a,
		      "b":data.b
		  },
		  "success": function(payload) {
		      // handle user profile here
		      $('.hero-unit').html();	
		      
		      //$.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
		      $.storage.set( 'Sid', payload.b );
		      location.assign('success.html');
		      //console.log(JSON.stringify(payload));
		  },
		  "error": function(d,msg) {
		      alert("Im Sorry, but there was an error communicating with the Phone Verification Server.");
		  }
	});
});

});
