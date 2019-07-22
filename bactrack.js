var secret = 'DLGTF0lCB0wvCwBN';
var code = window.location.href.split('#')[1].split('=')[2].split('&')[0];
var access_token;
function getToken(){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      access_token = data.access_token;
    }
  });
  xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=da44o7CQ3LaWEFvlYURveXoxe&client_secret='+secret+'&code='+code+'&grant_type=authorization_code');
  xhr.send(stuff);
}

function getActivities(){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText); 
    }
  });

  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}