///////////////call fitbit api with user creds
//getting the access token from url
var access_token = window.location.href.split('#')[1].split('=')[1].split('&')[0];

// get the userid
var userId = window.location.href.split('#')[1].split('=')[2].split('&')[0];

console.log(access_token);
console.log(userId);


var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/heart/date/today/1d.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function() {
   if (xhr.status === 200) {
      //console.log(xhr.responseText);
      //document.write(xhr.responseText);
      
      var data = JSON.parse(xhr.responseText);
      var obj = [data];
      console.log(userId +"'s active minutes for "+ obj[0]["activities-heart"][0].dateTime);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[1].minutes);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[2].minutes);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[3].minutes);
	  
   }
};
xhr.send()

var xhr2 = new XMLHttpRequest();
xhr2.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/tracker/steps/date/today/1d.json');
xhr2.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr2.onload = function() {
   if (xhr2.status === 200) {
      console.log(xhr2.responseText);
      //document.write(xhr2.responseText);
      /*
      var data = JSON.parse(xhr2.responseText);
      var obj = [data];
      console.log(userId +"'s active minutes for "+ obj[0]["activities-heart"][0].dateTime);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[1].minutes);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[2].minutes);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[3].minutes);
	  */
   }
};
xhr2.send()