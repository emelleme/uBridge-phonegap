function getProfile(userId) {

    $.jsonp({
      "url": "http://gdata.youtube.com/feeds/api/users/"+userId+"?&callback=?",
      "data": {
          "alt": "json-in-script"
      },
      "success": function(userProfile) {
          // handle user profile here 
          alert("Profile Found! ");
          console.log(userProfile.entry.author[0].name);
      },
      "error": function(d,msg) {
          alert("Could not find user "+userId);
      }
    });
}

$( '#startPage' ).live( 'pageinit',function(event){
  alert( 'This page was just enhanced by jQuery Mobile!' );
  $("#next").bind( "click", function(e, ui) {
		console.log('test');
		e.stopImmediatePropagation();
		e.preventDefault();
		$.mobile.showPageLoadingMsg();	
		//Do important stuff....
		$.jsonp({
		  "url": "http://ubridge.mobi/api/verifyPhone?callback=?",
		  "data": {
		      "phone": "2677026516"
		  },
		  "success": function(payload) {
		      // handle user profile here
		      alert("SMS on its way! "+payload.sid); 
		  },
		  "error": function(d,msg) {
		      alert("Im Sorry, but there was an error communicating with the Phone Verification Server.");
		  }
		});
		
		return false;
	});
});

$(document).ready(function() {
	
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
