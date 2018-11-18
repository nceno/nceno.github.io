///////////////call fitbit api with user creds
//getting the access token from url
var access_token = window.location.href.split('#')[1].split('=')[1].split('&')[0];

// get the userid
var userId = window.location.href.split('#')[1].split('=')[2].split('&')[0];

console.log(access_token);
console.log(userId);

$("#logBtn").click(function() {
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/heart/date/today/1d.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function() {
   if (xhr.status === 200) {
      //console.log(xhr.responseText);
      //document.write(xhr.responseText);
      
      var data = JSON.parse(xhr.responseText);
      var obj = [data];
      var fatBurn = obj[0]["activities-heart"][0].value.heartRateZones[1].minutes;
      var cardio = obj[0]["activities-heart"][0].value.heartRateZones[2].minutes;
      var peak = obj[0]["activities-heart"][0].value.heartRateZones[3].minutes;
      var formattedTime = Date.parse(obj[0]["activities-heart"][0].dateTime)/1000;

      console.log(userId +"'s active minutes for "+ obj[0]["activities-heart"][0].dateTime);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[1].minutes);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[2].minutes);
	  console.log(obj[0]["activities-heart"][0].value.heartRateZones[3].minutes);
	  console.log(formattedTime);

	  var sessionMins = fatBurn + cardio + peak;
	  console.log(sessionMins);
	  console.log(formattedTime);
	  
	  GoalFactory.settleLog(
                userId, 
                sessionMins,
                formattedTime,
                {from: web3.eth.accounts[0], gas: 3000000, gasPrice: 12000000000},
                function(error, result) {
                    if (!error){
                      //echo the result and do some jquery loader stuff
                    }
                      else
                      console.error(error);
                })//close contract function call
	  
	  
   }
};
xhr.send()
});//close click(function(){


