$("#loaderGlobal").hide();
$("#openWalletGlobal2").hide();
//initialize portis
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'rinkeby', { gasRelay: true, scope: ['email'] });
const web3 = new Web3(portis.provider);


console.log("this shit loaded.");


//set auth creds if they exist
var access_token;
if(Cookies.get('access_token') != 'undefined'){
	access_token = Cookies.get('access_token');
}	

var stravaID; 
if(Cookies.get('stravaID') != 'undefined'){
	stravaID = Cookies.get('stravaID');
}
var stravaUsername; 
if(Cookies.get('stravaUsername') != 'undefined'){
	stravaUsername = Cookies.get('stravaUsername');
}

var code;
window.onload = function() {
  $("#brandsPrompt").html('<p>this shit loaded</p>');
  console.log("this shit loaded.");

	//case 1- if you're missing everything,
	if(Cookies.get('access_token') == 'undefined' || Cookies.get('stravaID') == 'undefined'){ 
    console.log("doing case 1: missing everything...");

		$("#stravaBtnGlobal").show();
		//$("#portisBtnGlobal").show();
		$("#userPrompt").html('');
    $("#brandsPrompt").html('<p>You need to log in! <a href="www.nceno.app/brandchallenges.html">click here</a></p>');

		//and you've been redirected from strava auth page,
			//@config  the path (and file name) will change if this is a corp well challenge
		if (window.location.href != 'https://www.nceno.app/brandchallenges.html' 
			&& window.location.href != 'https://www.nceno.app/brandchallenges'
			&& window.location.href != 'https://nceno.app/brandchallenges'
			&& window.location.href != 'https://nceno.app/brandchallenges.html'

			&& window.location.href != 'https://www.nceno.app/brandchallenges.html#' 
			&& window.location.href != 'https://www.nceno.app/brandchallenges#'
			&& window.location.href != 'https://nceno.app/brandchallenges#'
			&& window.location.href != 'https://nceno.app/brandchallenges.html#'){
			//capture the code,
			code = window.location.href.split('=')[2].split('&')[0];
			console.log(code);
			//redeem it for the token,
			getTokenGlobal();
			//then log into portis. (included in gettoken)
		}
	}
	
	//case 2- missing portis only
	else if( Cookies.get('stravaUsername') == 'undefined'){
    console.log("doing case 2: missing portis only...");

		$("#stravaBtnGlobal").hide();
    $("#brandsPrompt").html('<p>You need to log in! <a href="www.nceno.app/brandchallenges.html">click here</a></p>');
		//$("#portisBtnGlobal").show();
		//$("#userPrompt").html("Activate points wallet continue...");
		showPortisGlobal();

		
	}
	//case 3- nothing missing
		//-----disable this block when testing.------
	else if(Cookies.get('access_token') != 'undefined' && Cookies.get('stravaID') != 'undefined' && Cookies.get('stravaUsername') != 'undefined'){
		console.log("doing case 3: missing nothing...");

    $("#stravaBtnGlobal").hide();
		$("#openWalletGlobal22").show();
		//$("#portisBtnGlobal").hide();
		$("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+stravaUsername+'</h5>');
    $("#brandsPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+stravaUsername+'</h5>');
	}
}

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

      //set the token in cookies
      access_token = data.access_token;
      Cookies.set('access_token', access_token, {
    	expires: inSixHours
      });

      //set the stravaID in cookies
      stravaID = data.athlete.id;
      Cookies.set('stravaID', stravaID);

      $("#stravaBtnGlobal").hide();
      if(Cookies.get('stravaUsername') == 'undefined'){
      	//$("#userPrompt").html("Activate points wallet continue...");
      	showPortisGlobal();
      }else{
        $("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+stravaUsername+'</h5>');
        $("#brandsPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+stravaUsername+'</h5>');
      }
      console.log("Nceno User ID: "+stravaID+"   Nceno Email: "+portisEmail+"   Wallet address: "+web3.eth.defaultAccount);
    }
  });
  //allofnceno ONEOFUS!
  xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=41825&client_secret=790acb08d1be8c0e1930a5fdcaee01d6139e04c8&code='+code+'&grant_type=authorization_code');
  //xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(stuff);
}

var portisEmail;
//signs user into portis and stores their wallet address as the default wallet address in web3
function showPortisGlobal() {
  $('#loaderGlobal').show();
  setTimeout("$('#loaderGlobal').hide();", 5000);
  // will only open the portis menu
  portis.showPortis(() => {  
  });
  portis.onLogin((walletAddress, email) => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      portisEmail = email;
      stravaUsername= portisEmail.substring(0, portisEmail.lastIndexOf("@"));
      Cookies.set('stravaUsername', stravaUsername);

      //$("#portisBtn").hide();
      updateGasPrice();

      //if this fills in the blanks for auth creds,
      if(Cookies.get('access_token') != 'undefined' && Cookies.get('stravaID') != 'undefined'){
      	//say so.
      	$("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+stravaUsername+'</h5>');
        $("#brandsPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+stravaUsername+'</h5>');
      }
      $("#openWalletGlobal2").show();
      
    });
  });
}

function showWallet(){
	$('#loaderGlobal').show();
	setTimeout("$('#loaderGlobal').hide();", 5000);
    portis.showPortis(() => {  
    });
}