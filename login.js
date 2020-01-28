$("#portisLoaderGlobal").hide();
//initialize portis
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'rinkeby', { gasRelay: true, scope: ['email'] });
const web3 = new Web3(portis.provider);

var portisEmail;
//signs user into portis and stores their wallet address as the default wallet address in web3
function showPortisGlobal() {
  $('#portisLoaderGlobal').show();
  setTimeout("$('#portisLoaderGlobal').hide();", 5000);

  // will only open the portis menu
  portis.showPortis(() => {
  });

  portis.onLogin((walletAddress, email) => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      portisEmail = email;
      getTokenGlobal();
      $("#portisBtnGlobal").hide();
      $("#portisSuccess").html('<h5><a style="color:#ffffff;">Connection: </a></h5><a style="color:#ccff00;">successful!</a>');   
    });
  });
}

window.onload = function() {
	//delays extraction of the strava creds until the user has authed.
	if (window.location.href != 'https://www.nceno.app/brandchallenges.html' 
		&& window.location.href != 'https://www.nceno.app/brandchallenges'
		&& window.location.href != 'https://nceno.app/brandchallenges'
		&& window.location.href != 'https://nceno.app/brandchallenges.html'){
		$("#stravaBtnGlobal").hide();
		$("#stravaOk").html("Proceed to step 2")
		$("#stravaOk").show();
	}
}

//gets the access token to make GET request. Valid for 6 hours.
var access_token;
var stravaID;
var stravaUsername;
var userCreated;
var uniqueUserString;
/*var code = window.location.href.split('#')[1].split('=')[2].split('&')[0];*/
var code = window.location.href.split('=')[2].split('&')[0];

var inSixHours = 0.24;


function getTokenGlobal(){
  console.log("code is: "+code);
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      access_token = data.access_token;
      Cookies.set('access_token', access_token, {
    	expires: inSixHours
      });

      stravaID = data.athlete.id;
      Cookies.set('stravaID', stravaID, {
    	expires: inSixHours
      });

      stravaUsername = portisEmail.substring(0, portisEmail.lastIndexOf("@"));
      Cookies.set('stravaUsername', stravaUsername, {
    	expires: inSixHours
      });

      $("#stravaOk").hide();
      $("#stravaSuccess").html('<h5><a style="color:white;">Welcome, </a></h5>'+stravaUsername);
      userCreated = Date.parse(data.athlete.created_at);
      uniqueUserString = stravaID.toString() + userCreated.toString();
      userID1 = uniqueUserString;
      //console.log(uniqueUserString);

      console.log("Nceno User ID: "+stravaID+"   Nceno Email: "+portisEmail+"   Wallet address: "+web3.eth.defaultAccount);
      $("#athleteInfo").html('<p>Nceno User ID: "'+stravaID+'"   <br>Nceno Email: "'+portisEmail+'"   <br>Wallet address: "'+web3.eth.defaultAccount.slice(0, 22)+' '+web3.eth.defaultAccount.slice(23, 42)+'"</p>');
    }
  });
  //allofnceno ONEOFUS!
  xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=41825&client_secret=790acb08d1be8c0e1930a5fdcaee01d6139e04c8&code='+code+'&grant_type=authorization_code');
  //xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(stuff);
}