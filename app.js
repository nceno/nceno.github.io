// get the url
var url = window.location.href;

//getting the access token from url
var access_token1 = url.split("#")[1].split("=")[1].split("&")[0];

// get the userid
var userId1 = url.split("#")[1].split("=")[2].split("&")[0];

console.log(access_token1);
console.log(userId1);

var access_token= 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkQ1U04iLCJzdWIiOiI2TTM1NkIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJybG9jIHJhY3QgcmhyIHJwcm8iLCJleHAiOjE1NzM1NTgwNTMsImlhdCI6MTU0MjAyNDQ2NH0.Kke008tn1ekWY57ekez0298feEjhNSKlKyXMjDQSWX4';
var userId= '6M356B';


var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/heart/date/today/1w.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function() {
   if (xhr.status === 200) {
      console.log(xhr.responseText);
      document.write(xhr.responseText);
   }
};
xhr.send()