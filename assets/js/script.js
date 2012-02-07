function getProfile(userId) {

    $.jsonp({
      "url": "http://gdata.youtube.com/feeds/api/users/"+userId+"?&callback=?",
      "data": {
          "alt": "json-in-script"
      },
      "success": function(userProfile) {
          // handle user profile here 
          alert("Profile Found! ");
          //console.log(userProfile.entry.author[0].name);
      },
      "error": function(d,msg) {
          alert("Could not find user "+userId);
      }
    });
}

$( '#startPage' ).live( 'pageinit',function(event){
	
  $("#next").bind( "click", function(e, ui) {
		
		e.stopImmediatePropagation();
		e.preventDefault();
		$.mobile.changePage($("#verify-phone")); 
		//Do important stuff....
		$.mobile.showPageLoadingMsg();
		var uname = $('#name').val();
		if(uname == ''){
			alert('Please enter your name.');
			$.mobile.hidePageLoadingMsg();	
			return false;
		}
		
		var phone = $('#phone').val();
		var fullName = $('#name').val();
		
		/* If phone is blank, create user */
		if(phone == ''){
			alert('You did not enter a phone number for verification, so you will not be able to receive uMessages. You can add your number from the settings menu once you login.');
			$.mobile.hidePageLoadingMsg();
			$.mobile.changePage($("#user-login")); 
			return false;
		}
		
		
		$.jsonp({
		  "url": "https://api-microbridge.rhcloud.com/api/verifyPhone?callback=?",
		  "data": {
		      "phone":phone,
		      "fullName":fullName
		  },
		  "success": function(payload) {
		      // handle user profile here
		      
		      
		      $.storage.set( payload.pin, payload.pin );
		      $.storage.set( 'PData', JSON.stringify(payload) );
		      $.mobile.changePage($("#verify-phone")); 
		      //console.log(JSON.stringify(payload));
		      $.mobile.hidePageLoadingMsg();
		  },
		  "error": function(d,msg) {
		      alert("Im Sorry, but there was an error communicating with the Phone Verification Server.");
		  }
		});
		
		return false;
	});
});


$( '#verify-phone' ).live( 'pageinit',function(event){	
	$("#next-login").bind( "click", function(e, ui) {
		e.stopImmediatePropagation();
	e.preventDefault();
	var pin = $('#SmsPin').val();
	$storage = new $.store();
	var data = $storage.get('PData');
	var phone = data.phone;
	/* If phone is blank, create user */
	if(phone == ''){
		alert('You did not enter a phone number for verification, so you will not be able to receive uMessages. You can add your number from the settings menu once you login.');
		 $.mobile.hidePageLoadingMsg();
		return false;
	}
	
	$.mobile.changePage($("#get-started"));
	
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
		      $('#verify-status').html('<p><a href="http://beta.ubridge.mobi">Connect your application to your Facebook Account.</a></p><p>Text <strong>#status</strong> to <strong>202-800-1827</strong> to get a status update.</p>');
		      //$.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
		      $.storage.set( 'Sid', payload.b );
		      //console.log(JSON.stringify(payload));
		      
		  },
		  "error": function(d,msg) {
		      alert("Invalid Pin. Try again");
		      $.mobile.hidePageLoadingMsg();
		  }
	});
		$.mobile.hidePageLoadingMsg();
		return false;
	});
});

$( '#get-started' ).live( 'pageinit',function(event){	
	var data = $.storage.get('PData');
	
	data = data;
	var fullname = data.fullName;
	$('#get-started h2 span').html(fullname);
	/* $("#fb-auth").bind( "click", function(e, ui) {
		$.storage = new $.store();
		e.stopImmediatePropagation();
		e.preventDefault();
		$.mobile.showPageLoadingMsg();	
		
		//Do important stuff....
		
		//Check Pin
		var testpin = $('#pinField input[id="SmsPin"]').val();
		
		if(!$.storage.get(testpin)){
			console.log('test failed');
			alert("Invalid Pin try again.");
			$.mobile.hidePageLoadingMsg();		
			//console.log($();
			return false;
		}else{
			var payload = $.storage.get('PData');
			//payload = JSON.parse(payload);
			//console.log(payload);
			$.storage.flush();
			$.storage.set("formattedPhone", payload.formattedPhone);
			$.storage.set("phone", payload.phone);
			$.storage.set("fullName", $('#startField input[id="name"]').val());
			$.mobile.changePage($("#user-login"));
		}
		
		
	}); */
});

$(document).ready(function() {
	$.storage = new $.store();
	var init = function(){
		//getProfile('smosh');
		//get the current location
		
		//This Sections are all optional so we have to check if they exist before init
		
		//countdown
		if ($('#countdown').length) {
			var c = new countdown();
			c.start();
		}
		
	};
	
	
/* COUNTDOWN SECTION START
  *  
  *  This part for the Countdown
  */

    var countdown = function () {

        var interval, i = 0,
            now, finish = new Date(params.targetDate),
            values = [0, 0, 0, 0],
			text = '',
			d = $('#days'),
			h = $('#hours'),
			m = $('#minutes'),
			s = $('#seconds');

		console.log(params.targetDate);
        //Make Countdown visible and fade in
        $('#countdown').hide().css('visibility', 'visible').fadeIn('slow');


        //method for setting the values
        function setValues() {
			printValue(d, values[0]);
			printValue(h, values[1]);
			printValue(m, values[2]);
			printValue(s, values[3]);
		}

        
		function printValue(el, value) {

            //if the letter exists
            if (el.length) {
				if(!values[0]){
					//days are 0 so delete it
					d.remove();
					if(!values[1]){
						//hours are 0 so delete it
						h.remove();
						if(!values[2]){
							//minutes are 0 so delete it
							m.remove();
						}
					}
				}
                drawLetters(el, value.toString());
            }
        }

        //method for drawing letters
        function drawLetters(el, value) {
            var d = [],
                v = '',
                l,
				id = el.attr('id'),
				name = params.texts[id];
						
            //increment each letter and wrap it with a span tag
            for (var i = 0; i < value.length; i++) {
                l = value.substr(i, 1);
                d.push(l);
                v += '<span class="letter c i_' + l + '">&nbsp;</span>';
            }
			//take the singular
			if(value == 1){
				name = params.texts[id.substring(0,id.length-1)];	
			}
            //write the new letters in the element
            el.html(v+name+'');
            console.log(v+name);
        }

        //method for Interval. sets the values
        function calc() {
           var now = new Date(),
           	sec = Math.round((finish - now) / 1000);

            //targetDate is in the future
            if (sec >= 0) {
                values[0] = calcdiff(sec, 86400, 100000);
                values[1] = calcdiff(sec, 3600, 24);
                values[2] = calcdiff(sec, 60, 60);
                values[3] = calcdiff(sec, 1, 60);
            //targetDate is in the back
            } else {
				//clear the Interval
                clearInterval(interval);
				//redirect to te specific url
                if (params.redirectto) {
                    //redirect to if set
                   window.location.href = params.redirectto;
                }
            }
            setValues();

        }

        //calcs the different
        function calcdiff(sec, n1, n2) {
            var s = ((Math.floor(sec / n1)) % n2).toString();
            return parseInt(s,10);
        }

        //first calc
        calc();


        //public methods
        return {
            start: function () {
				interval = setInterval(function () {
					calc();
				}, 1000);
            }
        };
    };

/* COUNTDOWN SECTION END

	*/
	
	init();
});
