function reminder(_target, _minutes, _frequency, _duration, _goalid, _start, _end){
	$('#'+_target).html('<a href ="	https://www.google.com/calendar/render?action=TEMPLATE&sf=true&output=xml&text=Your%20Nceno%20goal&location=www.nceno.app/app.html&details=You%20committed%20$' 
		+ STAKE '%20to%20working%20out%20for%20' + MINUTES+ 'min,%20'+ FREQUENCY+ 'x%20per%20week,%20for%20'+ DURATION 
		+ '%20weeks.%20The%20challenge%20ID%20is%20'+GOALID+'&dates='+STARTyyyymmddT160000Z+'/'+ENDyyyymmddT160000Z
		+'target="_blank" id="reminder">Add to Google Calendar</a>');
}


function stravaShare(_start, _minutes, _stake, _requency, _weeks, _goalid){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
  	if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
    }
  });
  xhr.open("POST", "https://www.strava.com/api/v3/activities" name='Anyone wanna join me?' type='workout' start_date_local='START' elapsed_time='MINUTES' description='I’m hosting a challenge worth $STAKE to workout for MINUTESmins, FREQUENCYx per week, for WEEKS weeks. If you wanna join me, the challenge ID is GOALID. Go to www.nceno.app/app and search for it.');
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}