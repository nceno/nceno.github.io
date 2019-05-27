$('#reminderLink').html('<a href ="	https://www.google.com/calendar/render?action=TEMPLATE&sf=true&output=xml&text=Your%20Nceno%20goal&location=www.nceno.app/app.html&details=You%20committed%20$' 
	+ STAKE '%20to%20working%20out%20for%20' + MINUTES+ 'min,%20'+ FREQUENCY+ 'x%20per%20week,%20for%20'+ DURATION 
	+ '%20weeks.%20The%20challenge%20ID%20is%20'+GOALID+'&dates='+STARTyyyymmddT160000Z+'/'+ENDyyyymmddT160000Z
	+'target="_blank" id="reminder">Add to Google Calendar</a>');


function stravaShare(){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
  	if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
    }
  });
  xhr.open("POST", 'https://www.strava.com/api/v3/activities" name='+value+' type='+value+' start_date_local='+value+' elapsed_time='+value+' description='+value);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}