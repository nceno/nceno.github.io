function getID(secret, obj){

}

const tgToken = "1130094704:AAE5-_tud_WqOx6d_S7ujEI8l97pUW5xFdI";
const chatID = "-1001412044137";

var db, stg, provider;

//////////////////////////////
//firebase cheat sheet-----------------------------------------------
//////////////////////////////

//read once (load)----------------------------------------------------
function Read() {
  db.ref('users/' + userId).once('value').then(function(snapshot) {
    //do stuff with snapshot.val();   ...or the  children ... snapshot.val().username;
  });
}


//get key text--------------------------------------------------------
function getKeyName() {
  var data = {
    "address":{
      "player":"Joe",
      "starts":7680609879
    }
  };
  var keySet = Object.keys(data);
  console.log(keySet[0]); //--- "address"
}


//listen for changes (stream)-----------------------------------------
//can also watch for: child_added, child_changed, child_removed
function ListenToStream() {
  db.ref('users/' + userId).on('value', function(snapshot) {
    //do stuff with...   snapshot.val();
  });
}

//order and filter a list------------------------------------------------------------

//order can use one at a time: orderByChild(), orderByKey(), orderByValue()
//filter can use: limitToFirst(100), limitToLast(5), startAt(>=), endAt(<=), equalTo(==)
function filterOrder() {
  var topUserPostsRef = db.ref('posts').orderByChild('metrics/views').limitToLast(5);
}


//add or update-----------------------------------------------------
function Add() {
  db.ref('challenges/QQQchalID/stats/').set(
    {
      "players" : 15,
      "totalCogs" : 50
    }
  );
}




//delete-------------------------------------------------------------
function Remove() {
  db.ref('users/' + userID).remove();
}




//batch (all-at-once)-----------------------------------------------
function UpdateMultiple() {
  var newKms = 39;
  var newData = {};

  newData['users/' + userID+'/exerciseStats/kms'] = newKms;
  newData['challenges/QQQchalID/leaderboard/QQQstravaID/0'] = newKms;
  newData['challenges/QQQchalID/stats/totalKms'] = newKms;

  db.ref().update(newData)
}


//collision-free transaction (for writing to high-traffic variables)------------
function SafeUpdate() {
  var newKms = 39;

  db.ref('challenges/QQQchalID/stats/totalKms').transaction(
    function(currentVal) {
      return currentVal + newKms;
    }
  );
}


//upload image to storage and put ref in database------------------------
function Upload(_stravaid){
  var picPath = stg.ref('userAvatars/'+_stravaid+'/'+file.name);
  var uploadTask = picPath.put(file);

  uploadTask.on('state_changed', function(snapshot){
  }, function(error){
    console.error(error);
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
      
      //todo: find current version in db and delete from storage

      //adds the img url to the db
      db.ref('users/'+_stravaid+'/meta/avatar').set(downloadURL);
    });
  });
}

//database rules-------------------------------------------------------
function Rules() {
  const auth = firebase.auth().currentUser;
  var obj={
    "rules":{

      //for root
      ".read": false,
      ".write": false,

      //for "users"
      "users":{

        //index by child for better performance
        ".indexOn": ["username", "picture"],

        //or by value (for leaderboard)
        ".indexOn": ".value",

        //conditional
        "$userId":{
          ".read": "auth.uid === $userId",
          ".write": "auth.uid === $userId"
        }
      },

      // readable node
      "messages":{
        ".read": true
      },

      // readable and writable node
      "messages":{
        ".read": true,
        ".write": true
      }
    }
  };
}
////////////////////////////////////////
//////////////////////////////
//-------------------------------------------/ end firebase cheat sheet--
//////////////////////
/////////////
///////
///



////////////
//navigate between pages (implemented as tab-panes)
////////////
  var pageHistory = ['browsePane'];

  function goBack(){
    pageHistory.pop();
    makeActive(pageHistory[pageHistory.length-1]);
    pageHistory.pop();
    console.log(pageHistory);
  }


  function makeActive(page){
    if(pageHistory.length>10){
      pageHistory.shift();
      pageHistory.push(page);
    }else pageHistory.push(page);
    //console.log(pageHistory);

    $( ".tab-pane" ).removeClass( "show active" );
    $( ".nav-item.nav-link" ).removeClass( "show active" );

    //inner tabs
    $('#chalTabs').addClass("show active");
    $('#profileTabs').addClass("show active");
    $('#chalPrev').addClass("show active");

    $('#joinedNav').data('lavalampActive',$('#chalTabs')).lavalamp('update');
    $('#profileNav').data('lavalampActive',$('#profileTabs')).lavalamp('update');
    $('#previewNav').data('lavalampActive',$('#chalPrev')).lavalamp('update');


    $('#'+page).addClass("show active");

    //inner panes
    /*    //mePane
    $('#challengesProfile').addClass("show active");
    //challengeTemplatePreview
    $('#overviewPreview').addClass("show active");
    //challengeTemplateJoined
    $('#overviewJoined').addClass("show active");*/

    //apply the appropriate header content
    var photo;
    var logo;
    var whiteTitle;
    var boldTitle;
    var subtitle;

    switch(page){
      // case "homePane":
      //   photo = "app/assets/images/fitness.jpg";
      //     logo = "app/assets/images/circle-logo.png";
      //   whiteTitle = "Welcome to ";
      //   boldTitle = "Nceno";
      //   subtitle = "Workout for a Payout";


      //   $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
      //     $('#logoDiv').remove();
      //     $('#headingDiv').prepend('<div id="logoDiv" class="col-4 col-lg-3"><img class="mr-3 avatar avatar-xl rounded" src="'+logo+'"></div>');
      //   $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
      //   $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
      //   //makeHomePane();
      // break;



      case "stravaPane":
        photo = "app/assets/images/onboarding.jpg";
          logo = null;
        whiteTitle = "Before we start... ";
        boldTitle = '';
        subtitle = "Step 1 of 3";

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
        $('#logoDiv').remove();
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeStravaPane();
      break;

      case "walletCreatePane":
        photo = "app/assets/images/onboarding.jpg";
          logo = null;
        whiteTitle = "Before we start... ";
        boldTitle = '';
        subtitle = "Step 2 of 3";

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
        $('#logoDiv').remove();
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeWalletCreatePane();
      break;

      case "walletCheckPane":
        photo = "app/assets/images/onboarding.jpg";
          logo = null;
        whiteTitle = "Before we start... ";
        boldTitle = '';
        subtitle = "Final step";

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
        $('#logoDiv').remove();
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeWalletCheckPane();
      break;

      case "finishSignupPane":
        photo = "app/assets/images/finished.jpg";
          logo = null;
        whiteTitle = "Setup finished ";
        boldTitle = '';
        subtitle = '';

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
        $('#logoDiv').remove();
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeFinishSignupPane();
      break;

      case "browsePane":
        photo = "app/assets/images/brands2.jpg";
          logo = null;
        whiteTitle = "Brand ";
        boldTitle = "Challenges";
        subtitle = "Turn your workouts into points to spend at shops and restaurants";

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
          $('#logoDiv').remove();
          //$('#headingDiv').prepend('<div id="logoDiv" class="col-4 col-lg-3"><img class="mr-3 avatar avatar-xl rounded" src="'+logo+'"></div>');
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeBrowsePane();
      break;

      case "mePane":
        $('#challengesProfile').addClass("show active");
        photo = "app/assets/images/instructions.jpg";
          logo = "https://dgalywyr863hv.cloudfront.net/pictures/athletes/39706111/11638934/2/large.jpg";
        whiteTitle = '';
        boldTitle = "Joe N";
        subtitle = "I'm a startup founder and enjoy hiking. Always up for a challenge or a workout! Taipei based. Add me on Strava.";

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
          $('#logoDiv').remove();
          $('#headingDiv').prepend('<div id="logoDiv" class="col-4 col-lg-3"><img class="mr-3 avatar avatar-xl rounded" src="'+logo+'"></div>');
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<h6 style="color:#999;">'+subtitle+'</h6><button class="btn btn-outline-white btn-rounded py-0 px-4" onclick="makeActive('+"'challengeTemplateJoined'"+');">edit bio</button>');
        //makeMePane();
      break;

      case "couponPane":
        photo = "https://pbs.twimg.com/media/DyT9-hlXQAACxQs?format=jpg&name=900x900";
          logo = "https://www.eddyscantina.com/wp-content/uploads/2014/09/Redpoint-Logo.png";
        whiteTitle = "600ml Beer";
        boldTitle = '';
        subtitle = "Not yet redeemed";

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
          $('#logoDiv').remove();
          //$('#headingDiv').prepend('<div id="logoDiv" class="col-4 col-lg-3"><img class="mr-3 avatar avatar-xl rounded" src="'+logo+'"></div>');
        $('#headingTitle').html('<h1 class="mb-0"><b>'+whiteTitle +'</b><b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeCouponPane();
      break;

      case "challengeTemplatePreview":
        $('#overviewPreview').addClass("show active");
        //photo = "https://pbs.twimg.com/media/DyT9-hlXQAACxQs?format=jpg&name=900x900";
          //logo = "https://www.eddyscantina.com/wp-content/uploads/2014/09/Redpoint-Logo.png";
        photo = null;
          logo = "app/assets/images/circle-logo.png";
        whiteTitle = "NCN ";
        boldTitle = "Challenge";
        subtitle = "for NCN coins";

        $('#headingPhoto').html('<div class="image  " style="background-color:#151515"></div>');
          $('#logoDiv').remove();
          $('#headingDiv').prepend('<div id="logoDiv" class="col-4 col-lg-3"><img class="mr-3 avatar avatar-xl rounded" src="'+logo+'"></div>');
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeChallengeTemplatePreviewPane();
      break;

      case "challengeTemplateJoined":
        $('#overviewJoined').addClass("show active");
        photo = "https://pbs.twimg.com/media/DyT9-hlXQAACxQs?format=jpg&name=900x900";
          logo = "https://www.eddyscantina.com/wp-content/uploads/2014/09/Redpoint-Logo.png";
        whiteTitle = "Summer Rush ";
        boldTitle = "Challenge";
        subtitle = "by Redpoint Brewing";

        $('#headingPhoto').html('<div class="image image-overlay image-cover" style="background-image:url('+photo+')"></div>');
          $('#logoDiv').remove();
          $('#headingDiv').prepend('<div id="logoDiv" class="col-4 col-lg-3"><img class="mr-3 avatar avatar-xl rounded" src="'+logo+'"></div>');
        $('#headingTitle').html('<h1 class="mb-0">'+whiteTitle +'<b style="color:#ccff00;">'+boldTitle+'</b></h1>');
        $('#headingSub').html('<p class="lead">'+subtitle+'</p>');
        //makeChallengeTemplatePreviewPane();
      break;


    }

  }

///////
//mobile nav bar
/////////
  var navPos, navOffset;
  $(document).ready(function () {

    var scrollPos = $(window).scrollTop(); //Current scroll's position of the window (at the beginning would be 0)
    navPos = $("#mnav").offset().top; //Current nav's position (at the beginnig would be wherever you set the nav)
    var navShowing = true; //Indicates whether the nav is currently shown or hidden.
    navOffset = -150; //Amount of pixels from its current position the nav will be moved to (adjust to size of navbar)
    var navMoveSpeed = 200; //Duration (in ms) of the nav's movement

    $(window).scroll(function () {
      var newScroll = $(this).scrollTop();
      if (newScroll > scrollPos) {
        //Scroll down the page: hide
        if (navShowing) {
          $('#collapsibleNavbar').removeClass('show');
          var newNavPos = navPos -= navOffset;
          $("#mnav").animate({ top: newNavPos }, navMoveSpeed);
          navShowing = false;
        }
      }
      else {
        //Scroll up the page: show
        if (!navShowing) {
          var newNavPos = navPos += navOffset;
          var setCompensate = newNavPos+85;
          $("#mnav").animate({ top: setCompensate }, navMoveSpeed);
          navShowing = true;
        }
      }
      scrollPos = newScroll;
    });

  });

  function expandMenu(){
    if(!$('#collapsibleNavbar').hasClass('show')){
      $('#collapsibleNavbar').addClass('show');
      var newNavPos = navPos + navOffset-100;
      $("#mnav").animate({ top: newNavPos }, 200);
    }
    else {
      $('#collapsibleNavbar').removeClass('show');
      var newNavPos = navPos - navOffset;
      $("#mnav").animate({ top: newNavPos }, 200);
    }
  }

////////
//telegram stuff
/////////
  

  //nceno makes the telegram group, sends a message to it with the body being the challenge id "0x345234kj5g3k4jh5334534524513"
  //then calls getTGchatlink to programatically get a join link put into the database, clickable in the app
  //get and set creds in database
    async function getTGchatlink(YourBOTToken, challenge){

      var stuff = null;
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.addEventListener("readystatechange", async function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          var data = JSON.parse(xhr.responseText);

          //get the chatID
          var str = JSON.stringify(data);
          var res = str.split(challenge)[0].split('"chat":{"id":');
          var chatID = res[res.length-1].split(',"title":')[0];

          //get the link to join
          await getTGjoinLink(YourBOTToken, chatID, challenge);

        }
      });
      xhr.open("POST", 'https://api.telegram.org/bot'+YourBOTToken+'/getUpdates');
      xhr.send(stuff);   
    }

    async function getTGjoinLink(YourBOTToken, chatID, challenge){
      var stuff = null;
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      await xhr.addEventListener("readystatechange", async function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          var data = JSON.parse(xhr.responseText);

          //get the joinLink and set it in the database
          //console.log(data.result);

          var id = chatID;
          var link = data.result;
          var newData = {};

          newData['https://nceno-app.firebaseio.com/challenges/brand/'+challenge+'/view/tgChatID'] = id;
          newData['https://nceno-app.firebaseio.com/challenges/brand/'+challenge+'/view/tgChatLink'] = link;

          await db.ref().update(newData);
        }
      });
      xhr.open("POST", 'https://api.telegram.org/bot'+YourBOTToken+'/exportChatInviteLink?chat_id='+chatID);
      xhr.send(stuff);
    }

  //send a message to a group
    function telegramNotify(message, chatID, silent) {
      var stuff = null;
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          var data = JSON.parse(xhr.responseText);
        }
      });
      //to get the chatID
      //https://api.telegram.org/bot<YourBOTToken>/getUpdates
      //to get the join link
      //https://api.telegram.org/bot<YourBOTToken>/exportChatInviteLink?chat_id=<chatID>
      xhr.open("POST", 'https://api.telegram.org/bottgToken/sendMessage?chat_id='+chatID+'&text='+message+'&parse_mode=html&disable_notification='+silent);
      xhr.send(stuff);
    }

/////////////
//sign in with google
///////////////
  function googleAuth(){

    provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithRedirect(provider).then(function() {
        return firebase.auth().getRedirectResult();
      }).then(function(result) {

        console.log(result);
        var token = result.credential.accessToken;
        var user = result.user;

        //show user creds, hide login
        $('#googleAuthBtn').hide();
        $('#greet').html('Welcome, '+user.displayName);

        //persist the session
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
        });

      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }

  //preferred way to get user creds (added to onDevice ready)
  /*firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      gmail = user.email;
      fullName = user.displayName;
      userID = user.uid;
    }
  }*/

  function sendEmail(temp, lang, recip){
    $.ajax({
      url: 'https://us-central1-nceno-app.cloudfunctions.net/'+temp+lang+'?'+recip,
      type:"GET",
      success: function(result){
        console.log(result)
      },
      error: function(error){
        console.log(error);
      }
    });
  }




/////////
//geolocation
/////////
var countryName, countryCode;
function getCountry(){
  $.getJSON("https://api.ipdata.co/?api-key=25948172f6d73640c781a87df67ef61f03bf5948cbc333f56fd0baf6", function(data) {
    countryName = data.country_name;
    countryCode = data.country_code;
  });
}

  var myLocation;
  var onSuccess = function(position) {
    console.log(
      'Latitude: '          + position.coords.latitude          + '\n' +
      'Longitude: '         + position.coords.longitude         + '\n' +
      'Altitude: '          + position.coords.altitude          + '\n' +
      'Accuracy: '          + position.coords.accuracy          + '\n' +
      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      'Heading: '           + position.coords.heading           + '\n' +
      'Speed: '             + position.coords.speed             + '\n' +
      'Timestamp: '         + position.timestamp                + '\n'
    );
    myLocation = [position.coords.latitude, position.coords.longitude];
  };

  function onError(error) {
    console.log('code: ' + error.code + '\n' +'message: ' + error.message + '\n');
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
  }

  // helper function to convert Degrees to Radians
  function Deg2Rad( deg ) {
     return deg * Math.PI / 180;
  }

  //get distance between two GPS coords in km
  function kmsBetween(_lat1, _lng1, _lat2, _lng2){       
    //define (lat1, lng1) = user
    //define (lat2, lng2) = shop
    var lat1 = Deg2Rad(_lat1); 
    var lat2 = Deg2Rad(_lat2); 
    var lng1 = Deg2Rad(_lng1); 
    var lng2 = Deg2Rad(_lng2);
    var latDiff = lat2-lat1;
    var lonDiff = lng2-lng1;
    var R = 6378; // kilometers
    //var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) + Math.cos(lat1) * Math.cos(lat2)* Math.sin(lonDiff/2) * Math.sin(lonDiff/2);
    //var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    //var d = R * c;
    //console.log('d: ' + d);
    var dist = Math.acos( Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2) * Math.cos(lonDiff) ) * R;
    console.log('dist: ' + dist + " kilometers");
    return(dist); //kilometers
  }


//////
// Wait for device API libraries to load
//////
  function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
  }


///////
//needed for cordova stuff
///////
var deviceID, gmail, fullName, userID;

  function onDeviceReady() {
    // Add similar listeners for other events
    console.log("the device is ready");
    //init firebase tools
    var firebaseConfig = {
          apiKey: "AIzaSyAmf3B-6AUN35I9ITLxxtjkK6ez0WCOyq4",
          authDomain: "nceno-app.firebaseapp.com",
          databaseURL: "https://nceno-app.firebaseio.com",
          projectId: "nceno-app",
          storageBucket: "nceno-app.appspot.com",
          messagingSenderId: "259476102338",
          appId: "1:259476102338:android:95fe94835867e2fe19ef5b",
          measurementId: "G-1LYKPNJ9QE"
        };
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    stg = firebase.storage();
    deviceID = device.uuid;
    console.log("deviceID is: "+deviceID);
    makeActive('browsePane');

    //preferred way to get user creds
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        gmail = user.email;
        fullName = user.displayName;
        userID = user.uid;
        console.log(`user signed in as: ${gmail} `);
      }
    });
  }

////////
//exchange code for strava token
////////
  function getStravaTokens(_code){
    var stuff = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        //console.log(this.responseText);
        var data = JSON.parse(xhr.responseText);
        //set the tokens and info
        var access_token = data.access_token;
        var refresh_token = data.refresh_token;
        var stravaID = data.athlete.id;
        db.ref('users/'+stravaID+'/meta').set({
          "access_token" : access_token,
          "refresh_token" : refresh_token
        });

        //show success and echo
        /*Swal.fire({
          icon: 'success',
          title: 'Welcome',
          showConfirmButton: false,
          timer: 1500
        });*/

        //go to next page
        makeActive('walletCreatePane');
        
      }
    });
    //joe@nceno.app creds
    xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=33084&client_secret=e4668610b5d6bee15fcd68d0cb88a1f656ae1ad3&code='+_code+'&grant_type=authorization_code');
    xhr.send(stuff);
  }

///////
//strava auth redirect
////////
  var endUrl = "https://nceno.app"; 
  var startUrl = "https://www.strava.com/oauth/authorize?client_id=33084&response_type=code&redirect_uri=http://www.nceno.app&approval_prompt=force&scope=read,profile:read_all,activity:read,activity:read_all,activity:write"; 
  var code, urlstring;
  function stravaLogin(){
    var browser = cordova.InAppBrowser.open(startUrl, '_blank', 'location=no');
    browser.addEventListener('loadstart', function(evt){
      urlstring = evt.url;
      console.log("evt.url = " + urlstring);

      if(urlstring.indexOf(endUrl)==0) {
        code = urlstring.split('=')[2].split('&')[0];
        console.log("code is: "+ code);
        browser.close();
        getStravaTokens(code);
      }
    });
    browser.addEventListener('loaderror', function(err) {
      console.log("error " + err);
    });
  }

///////
//strava refresh token
////////
  function refreshStravaTokens(_refresh_token){
    var stuff = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        //console.log(this.responseText);
        var data = JSON.parse(xhr.responseText);
        //set the tokens and info
        var access_token = data.access_token;
        var refresh_token = data.refresh_token;
        var stravaID = data.athlete.id;
        db.ref('users/'+stravaID+'/meta').set({
          "access_token" : access_token,
          "refresh_token" : refresh_token
        });        
      }
    });
    //joe@nceno.app creds
    xhr.open("POST", 'https://www.strava.com/api/v3/oauth/token?client_id=33084&client_secret=e4668610b5d6bee15fcd68d0cb88a1f656ae1ad3&grant_type=refresh_token&refresh_token='+_refresh_token);
    xhr.send(stuff);
  }


/////////
//signup modal
///////
  function walletCheck(guess){
    //todo: if guess == key.slice(60) then
    makeActive('finishSignupPane');

    //else makeActive('walletCreatePane'); and show error
  }



/////////
//download key and addr
////////
  function downloadAsFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

//////////
//click to copy address
//////////
  function copyAddressToClipboard(){
    var addr = "0x9847098fhfer";
    cordova.plugins.clipboard.copy(addr);
  }

/////////
//QR code scanner
//////////

  //scan
  function walletSendQR(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        alert("Scanned address: " + result.text);
        //todo: set "send to" field as result.text
      },
      function (error) {
        alert("Scanning failed: " + error);
      },
      {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : false, // iOS and Android
        showTorchButton : false, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: false, // Android, save scan history (default false)
        prompt : "Scan a wallet address QR code", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
      }
    );
  }

  //encode
  function makeQR(textToEncode){
    cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, textToEncode, function(success) {
      alert("encode success: " + success);
    }, function(fail) {
        alert("encoding failed: " + fail);
      }
    );
  }


  //admin scans a customer coupon to complete redeem
  function adminScan(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        //todo:handle the data
        db.ref('qrmess/').set(
          {
            0:result.text
          }
        );


      },
      function (error) {
        alert("Scanning failed: " + error);
      },
      {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : false, // iOS and Android
        showTorchButton : false, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: false, // Android, save scan history (default false)
        prompt : "Scan a coupon QR code", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
      }
    );
  }  

/////////////
//make a wallet key pair
/////////////

  function makeWallet(pw){

    //generate the key pair
    var addressData = Ejswal.generate();
    const acct = addressData.getAddressString();
    const rawKey = addressData.getPrivateKeyString();
    console.log("Address = "+addressData.getAddressString());
    console.log("Private key = "+addressData.getPrivateKeyString());

    //encrypt the key to store it on device
    const walletEncr = Ejswal.fromPrivateKey(Buffer.from(rawKey.substr(2), 'hex'));
    var jwallet = new Object;
    jwallet = walletEncr.toV3(pw);
    console.log("the encrypted key is: "+ JSON.stringify(jwallet));

    //write wallet to storage
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      console.log('file system open: ' + fs.name);
      fs.root.getFile("jwallet.json", { create: true, exclusive: false }, function (fileEntry) {

        fileEntry.createWriter(function (fileWriter) {

          fileWriter.onwriteend = function() {
              console.log("Successful file write...");
          };
          fileWriter.onerror = function (e) {
              console.log("Failed file write: " + e.toString());
          };
          
          fileWriter.write(jwallet);
        });

      });
    });

    //download for user to save
    //downloadAsFile("MY-NCENO-WALLET-ENCRYPTED", JSON.stringify(jwallet));
  }

/////////////
// init wallet
//& web3/gsn
///////////////


  //decrypt the wallet and initialize web3/gsn
  var walletDecr, exposedKey, myWalletAdr, myPrivKey, options, gsnprovider, web3, biconomy;
  function web3Init(pw){
    var jsonWallet = new Object;

    //read wallet from storage
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      console.log('file system open: ' + fs.name);
      fs.root.getFile("jwallet.json", { create: true, exclusive: false }, function (fileEntry) {

        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = async function() {
            console.log("Successful file read: " + this.result);

            //store it as a session variable
            jsonWallet = await JSON.parse(this.result);

            //init the wallet
            walletDecr = Ejswal.fromV3(jsonWallet, pw);
            exposedKey = walletDecr.getPrivateKey().toString('hex');
            console.log("the original raw key is: " + exposedKey);

            myWalletAdr = '0x'+jsonWallet.address;
            myPrivKey ='0x'+exposedKey;

            //old config... for GSN
            /*options = {signKey: myPrivKey};
            gsnprovider = new GSNProvider.GSNProvider("https://rinkeby.infura.io/v3/a1fe9427c2064efba8713b2e9d042c20", options);
            web3 = new Web3(gsnprovider);*/

            //new config... for biconomy
            if (window.Biconomy) {
              let Biconomy = window.Biconomy.default;
              biconomy = new Biconomy(new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/a1fe9427c2064efba8713b2e9d042c20')),{apiKey: 'yaTFGgBe2.a6e70460-9db4-4eb0-a5a0-ae72272f5d9f'});
              web3 = new Web3(biconomy);
            }

            //biconomy events and user login
            biconomy.onEvent(biconomy.READY, async () => {
              // Initialize your dapp here like getting user accounts etc
              console.log('biconomy is ready!');

              //const sigUtil = require('eth-sig-util')
              let message = await biconomy.getLoginMessageToSign(myWalletAdr.substr(2));
              let signature = sigUtil.signTypedMessage(new Buffer.from(myPrivKey.substr(2), 'hex'), 
                {data: message}, 'V3');

              // USING CALLBACKS
              biconomy.accountLogin(myWalletAdr.substr(2), signature, (error, response)=>{
                if(error) {
                  console.log(error);
                  return;
                }
                if(response.transactionHash) {
                  console.log('First time user. Contract wallet transaction pending.')
                  // Wait for confirmation using Contract Wallet Confirmation method below.
                } else if(response.userContract) {
                  console.log('Existing user login successful');
                }
              });
            }).onEvent(biconomy.ERROR, (error, message) => {
              // Handle error while initializing mexa
            });

            biconomy.onEvent(biconomy.LOGIN_CONFIRMATION, (log) => {
             // User's Contract Wallet creation successful
             console.log(`User contract wallet address: ${log.userContract}`);
            });
            //----end biconomy config

          };
          reader.readAsText(file);
        });
      });
    });
  }

  



///////////
//function wrapper: TokenLauncher.new token()
//////////
  function launchNewToken(_supply, _symbol, _name, _contractAddress){
    var TokenLauncher = new web3.eth.Contract(TokenLauncherABI, _contractAddress);
    TokenLauncher.methods.newToken(
      _supply, 
      _symbol, 
      _name
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

        //grab address from event
        TokenLauncher.events.TokenDeployed({
          //filter: {paramGoalID: _goalid, paramStravaID: Cookies.get('stravaID'), finisher: true },
          fromBlock: 0, toBlock: 'latest'
        }, function(error, event){ 
            console.log('token address: '+event.returnValues._newToken);
          }
        ).on('error', console.error);
      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }



///////////
//function wrapper: BrandToken.makeVoucher()
//////////
  function makeVoucher(_item, _vcode, _chalAdr, _contractAddress){
    var BrandToken = new web3.eth.Contract(BrandTokenABI, _contractAddress);
    BrandToken.methods.makeVoucher(
      _item, 
      _vcode,  
      _chalAdr
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }


///////////
//function wrapper: BrandToken.readyVoucher()
//////////
  function readyVoucher(_vcode, _contractAddress){
    var BrandToken = new web3.eth.Contract(BrandTokenABI, _contractAddress);
    BrandToken.methods.readyVoucher( 
      _vcode
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }


///////////
//function wrapper: BrandToken.redeemVoucher()
//////////
  function redeemVoucher(_vcode, _contractAddress){
    var BrandToken = new web3.eth.Contract(BrandTokenABI, _contractAddress);
    BrandToken.methods.redeemVoucher( 
      _vcode
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }


///////////
//function wrapper: BrandToken.giftVoucher()
//////////
  function giftVoucher( _recipient, _vcode, _contractAddress){
    var BrandToken = new web3.eth.Contract(BrandTokenABI, _contractAddress);
    BrandToken.methods.giftVoucher(
     _recipient, 
      _vcode
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//function wrapper: BrandToken.transfer()
//////////
  function transfer(_to, _amount, _contractAddress){
    var BrandToken = new web3.eth.Contract(BrandTokenABI, _contractAddress);
    BrandToken.methods.transfer(
     _to, 
     _amount
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//function wrapper: ChallengeLauncher.newChallenge()
//////////
  function newChallenge(_start, _dur, _cap, _pot, _kmTokenRate, _bpmTokenRate, _token, _contractAddress){
    var ChallengeLauncher = new web3.eth.Contract(ChallengeLauncherABI, _contractAddress);
    ChallengeLauncher.methods.newChallenge(
     _start, 
     _dur, 
     _cap, 
     _pot, 
     _kmTokenRate, 
     _bpmTokenRate, 
     _token
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

        //grab address from event
        ChallengeLauncher.events.ChallengeDeployed({
          //filter: {paramGoalID: _goalid, paramStravaID: Cookies.get('stravaID'), finisher: true },
          fromBlock: 0, toBlock: 'latest'
        }, function(error, event){ 
            console.log('challenge address: '+event.returnValues._newChallenge);
          }
        ).on('error', console.error);
      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }


///////////
//function wrapper: Challenge.addInviteCodes()
//////////
  function addInviteCodes(_codes, _contractAddress){
    var Challenge = new web3.eth.Contract(ChallengeABI, _contractAddress);
    Challenge.methods.addInviteCodes(
     _codes
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//function wrapper: Challenge.addItems()
//////////
  function addItems( _items, _prices, _contractAddress){
    var Challenge = new web3.eth.Contract(ChallengeABI, _contractAddress);
    Challenge.methods.addItems(
      _items, 
      _prices
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//function wrapper: Challenge.changeExp()
//////////
  function changeExp(_days, _contractAddress){
    var Challenge = new web3.eth.Contract(ChallengeABI, _contractAddress);
    Challenge.methods.changeExp(
       _days
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//function wrapper: Challenge.join()
//////////
  function join(_inviteCode, _contractAddress){
    var Challenge = new web3.eth.Contract(ChallengeABI, _contractAddress);
    Challenge.methods.join(
       _inviteCode
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }


///////////
//function wrapper: Challenge.log()
//////////
  function log( _kms, _mins, _actID, _secretHash,  _currentBlock, _contractAddress){
    var Challenge = new web3.eth.Contract(ChallengeABI, _contractAddress);
    Challenge.methods.log(
      _kms, 
      _mins, 
      _actID, 
      _secretHash,  
      _currentBlock
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//function wrapper: Challenge.setRewMult()
//////////
  function setRewMult(_mult, _contractAddress){
    var Challenge = new web3.eth.Contract(ChallengeABI, _contractAddress);
    Challenge.methods.setRewMult(
       _mult
    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//function wrapper: Challenge.emptyContract()
//////////
  function emptyContract( _contractAddress){
    var Challenge = new web3.eth.Contract(ChallengeABI, _contractAddress);
    Challenge.methods.emptyContract(

    ).send({ from: myWalletAdr })
    ///////error handing and callback logic //////////
    .on('transactionHash', function (txHash) {
      console.log("Txn sent. Please wait for confirmation.");
      console.log(txHash);
    })
    .once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        console.log("Txn successful: "+receipt.status);
        //do anything here....

      }
      else{
        console.log("there was an error");
      } 
    }).once('error', function(error){console.log(error);});
  }

///////////
//google maps
//////////////
  function initMapOther() {
    map1 = new google.maps.Map(document.getElementById('mapRedpoint'), {

      zoom: 13,
      center: {lat: 25.041434, lng: 121.543851}, 
      disableDefaultUI: true,
      mapTypeId: 'roadmap',
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#181818"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8a8a8a"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3d3d3d"
            }
          ]
        }
      ]
    });
    var marker = new google.maps.Marker({
      position: {lat: 25.041434, lng: 121.543851},
      map: map1
    });

  }


///////////////////////////////////////
//////////////vvvvvvvvv getActivities()
///////////////////////////////////////

var speedLimit = 4.5; //in m/s
var speedLow = 1.4; //in m/s
var BPMthresh = 99; 
var sesLow = 1200; //in s
var HRreward; //loaded from page .onload
var KMreward; //loaded from page .onload
var placeholderDate = new Date();
placeholderDate.setDate(placeholderDate.getDate() - 30); //can change "1" day to "20" days for testing.
var yesterday =parseInt(parseInt(placeholderDate.getTime())/1000);
var nowDate = parseInt(parseInt(new Date().getTime())/1000);

var HR = new Array();  //HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
var GPS = new Array(); //GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
var toLog = new Array(3);

//HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
//GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
var data = new Object();

let i=0;
let j=0;
let k=0;

var GPSMaxID = null;
var GPSMaxVal=0;
var avgSpeedMax = 0;
var distMax = 0;
var timestampMax = null;

var hrMaxID = null;
var hrMaxVal=0;
var avgHRmax = 0;
var elapsed_timeMax = 0;

var bestID = null;
var bestVal = 0;
var identifier = null;

var dispHR;
var dispMins;
var dispTimeHours;
var dispTimeMinutes;
var dispSpeed;
var dispDist;
var dispValue;
var period;

async function makeActivities(){
  //---- Get the activities, clean them, and separate them into HR and GPS
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  await xhr.addEventListener("readystatechange", async function(){
    if (this.readyState === 4) {
      console.log(this.responseText);
      data = await JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      //clean the data and make a list of valid workouts.   
      if(data.length <1) console.log("no workouts today.");
      //HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
      //GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
      while(i<data.length){
        if(data[i].manual == false && data[i].has_heartrate == true){
          var HRvalid= false;
          if(data[i].average_heartrate>BPMthresh && data[i].elapsed_time>sesLow) {HRvalid =true;}
          HR.push([data[i].id, data[i].average_heartrate, data[i].elapsed_time, data[i].start_date, Math.floor(HRreward*data[i].elapsed_time/600), HRvalid]); //need to adjust time, hr, value, validity
          j++;
        }
        if(data[i].manual == false && data[i].distance > 0){
          var GPSvalid= false;
          if(data[i].distance>1000 && data[i].average_speed<speedLimit && data[i].average_speed>speedLow) {GPSvalid =true;}
          GPS.push([data[i].id, data[i].average_speed, data[i].distance, data[i].start_date, Math.floor(KMreward*data[i].distance/1000), GPSvalid]);
          k++;
        }
        else if(data[i].manual == false && data[i].has_heartrate == false && (data[i].distance == 0 || data[i].distance == null)){
          console.log("No valid workouts today...");
        }
        i++;
      }

      //echo the workouts
      console.log("the "+k+" GPS workouts are: ");
      console.table(GPS);
      console.log("the "+j+" HR workouts are: ");
      console.table(HR);

      
      //GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5

      //loop through GPS[m] to find max
      if(k>0){
        GPS.forEach(function(_G){
          if(_G[5]==true && _G[4]>GPSMaxVal){
            GPSMaxID = _G[0]; //<--- maybe the ID's collide if workout has both data?
            GPSMaxVal=_G[4];
          }
        });
      }

    }
    //else console.log("access_token is too old.");
  });
  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
  xhr.send(stuff);
}

///////////////////////////////////////
//////////////^^^^^^^^^^^ getActivities()
///////////////////////////////////////


///////////////////////////////////////
//////////////vvvvvvvvvvv gapAdjust()
///////////////////////////////////////
function gapAdjust(){
  HR.forEach(async function(_H){
    var adjHR;
    var activeTime;

    var stuff2 = null;
    var xhr2 = new XMLHttpRequest();
    xhr2.withCredentials = false;
    await xhr2.addEventListener("readystatechange", async function () {
      if (this.readyState === 4) {
        var resp = await JSON.parse(xhr2.responseText);
        var hr = resp.heartrate.data;
        var tm = resp.time.data;
        
        //----- gap detection -----
        var gap = 0;
        for(let s=0; s<tm.length+1; s++){
          var diff = tm[s+1]-tm[s];
          if(diff>=10){
            gap+=diff;
          }
        }

        //activeTime will replace elapsed_time
        activeTime = (1.0*tm[tm.length-1]-gap);
        var pl = 0;
        for(let r=0; r<hr.length; r++){
          pl +=hr[r];
        }
        var avghr = pl/hr.length;

        //adjHR will replace avgHR
        adjHR = (avghr*activeTime + 80*gap)/tm[tm.length-1];

        console.log("total gap is: "+gap/60+" min");
        console.log("real active time is: "+activeTime/60+" min");
        console.log("adjusted HR is: "+adjHR+" BPM");

        //this is the HR update step.....
        //HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
        
        _H[1]=adjHR;
        _H[2]=activeTime;
        _H[4]= Math.round(HRreward*activeTime/600);

        data.forEach(function(act){
          if (act.id == _H[0]){
            act.elapsed_time = activeTime;
            act.average_heartrate = adjHR;
          }
        });

        //---- /gap detection -----
      } 
    });
    xhr2.open("GET", 'https://www.strava.com/api/v3/activities/'+_H[0]+'/streams?keys=heartrate,time&series_type=time&key_by_type=true');
    xhr2.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
    xhr2.send(stuff2);
  });
}

function latlngStream(){
  var stuff2 = null;
  var xhr2 = new XMLHttpRequest();
  xhr2.withCredentials = false;
  xhr2.addEventListener("readystatechange", async function () {
    if (this.readyState === 4) {
      var resp = await JSON.parse(xhr2.responseText);
      console.log(resp);
      
    } 
  });
  xhr2.open("GET", 'https://www.strava.com/api/v3/activities/3144943911/streams?keys=latlng,time&series_type=time&key_by_type=true');
  xhr2.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
  xhr2.send(stuff2);
}



///////////////////////////////////////
//////////////^^^^^^ gapAdjust()
///////////////////////////////////////


///////////////////////////////////////
//////////////vvvvvvvvv find best and show in UI
///////////////////////////////////////

function showBest(){
  //find the max HR workout
  if(j>0){
    HR.forEach(function(_H){
      if(_H[5]==true && _H[4]>hrMaxVal){
        hrMaxID = _H[0];
        hrMaxVal=_H[4];
      }
    });
  }

  //compare the max values and return the id of the best one
  if(GPSMaxVal>=hrMaxVal){
    bestVal = GPSMaxVal;
    bestID = GPSMaxID;
    identifier = "GPS";
    //hide bmp mins
  }
  else {
    bestVal = hrMaxVal;
    bestID = hrMaxID;
    identifier = "HR";
  }
  console.log("the best one is a "+identifier+" workout: "+bestID+", which is worth "+Math.round(bestVal)+" SUN tokens");

  //get the full details of that activity
  data.forEach(function(_A){
    if(_A.id==bestID){
      //console.log(_A);

      dispTimeHours = new Date(_A.start_date).getHours()//-_A.utc_offset/3600;  may need to use start_date_local
      if(dispTimeHours%12>=0){
        if(dispTimeHours%12==0){
          dispTimeHours = 12;
        }
        else {dispTimeHours = dispTimeHours%12;}
        period = "pm";
      }
      else{
        period = "am";
      }

      dispHR = _A.average_heartrate; //needs to be adjusted
      
      dispMins = _A.elapsed_time; //needs adjusted
      
      dispValue = Math.round(bestVal); //needs adjusted

      //_A.utc_offset/3600

      dispTimeMinutes = new Date(_A.start_date_local).getMinutes();
      if(dispTimeMinutes<10){dispTimeMinutes = "0"+dispTimeMinutes;}
      dispSpeed = _A.average_speed;
      dispDist = _A.distance;
      
    }
  });
  //console.log("display this: "+dispTime+" "+dispMins+" "+dispHR+" "+dispDist+" "+dispSpeed+" "+dispValue);
  /*  if(dispHR!= null && dispHR!= 0) $("#dispHR").html(Math.round(dispHR)); 
    if(dispMins!= null && dispMins!= null && dispHR!= null ) $("#dispMins").html(Math.round(dispMins/60));
    $("#dispTime").html(dispTimeHours+':'+dispTimeMinutes);
    $("#period").html(period); 
    if(dispSpeed!= null && dispSpeed!= 0) $("#dispSpeed").html((dispSpeed*3.6).toFixed(1));
    if(dispDist!= null && dispDist!= 0) $("#dispDist").html((dispDist/1000).toFixed(1)); 
    $("#dispValue").html(dispValue);
    $("#dispToken").html(TOKENSYMBOL);*/

  var alHR = '-';
  if(dispHR!= null && dispHR!= 0) 
    alHR = Math.round(dispHR); 

  var alMins = '-';
  if(dispMins!= null && dispMins!= null && dispHR!= null ) 
    alMins = Math.round(dispMins/60);

  var alSpeed = '-';
  if(dispSpeed!= null && dispSpeed!= 0) 
    alSpeed = (dispSpeed*3.6).toFixed(1);

  var alDist = '-';
  if(dispDist!= null && dispDist!= 0) 
    alDist = (dispDist/1000).toFixed(1);

  Swal.fire({
    title: 'Here is your most valuable workout from today',
    html: '<table class="table table-lined" id="bestWorkout"><thead  class="thead-dark"> <tr><th scope="col"><font size="2">time</font></th> <th scope="col"><font size="2">HR mins</font></th><th scope="col"><font size="2">avg HR</font></th><th scope="col"><font size="2">dist</font></th><th scope="col"><font size="2">avg speed</font></th></tr></thead><tbody ><tr><td ><span id="dispTime">'+dispTimeHours+':'+dispTimeMinutes+'</span><br><span id="period">'+period+'</span></td><td ><span id="dispMins">'+alMins+'</span><br>min</td><td ><span id="dispHR">'+alHR+'</span><br>bpm</td><td ><span id="dispDist">'+alDist+'</span><br>km</td><td ><span id="dispSpeed">'+alSpeed+'</span><br>kph</td></tr></tbody></table>',
    confirmButtonText:'Claim '+dispValue+' '+TOKENSYMBOL
  }).then((result) => {
  if (result.value) {
    redeem();
    Swal.fire({
      imageUrl: '../app/assets/images/loader.svg',
      title: 'Please wait...',
      showConfirmButton: false
    });
  }
})

  //make the thing to be logged
  toLog[0] = bestID;
  if(identifier == "HR"){
   toLog[2] = Math.round(dispMins/60);
   toLog[1] = 0;
  }
  else if(identifier == "GPS"){
    toLog[2] = 0;
    toLog[1] = Math.round(dispDist/1000);
  }
}

///////////////////////////////////////
//////////////^^^^^^^^^^ find best and show in UI
///////////////////////////////////////


///////////////////////////////////////
//////////////vvvvvvvv nceno.log()
///////////////////////////////////////

function resetLog(){
  $('#redeem').show();
    //makeWorkoutPage();   //might cause a bug..
  $("#logLoader").hide();
}
$('#logModal').on('hidden.bs.modal', function (e) {
  resetLog();
});


function redeem(){
  $("#logLoader").show();
  $("#redeem").hide();

  NcenoBrands.methods.log(
    _goalID, 
    Cookies.get('stravaID'), 
    toLog[1], 
    toLog[2], 
    toLog[0], 
    "0x22222",
    345
  )
  .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){
        
        console.log(result);
      }
      else

      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){
    console.log(receipt.status);
    if(receipt.status === true){
        correctNonce++;
        //$("#logLoader").hide();
        //$("#logSuccess").html("Great job! Check your points wallet in a minute.");
        //listen to see if player is a first finisher
        Nceno.events.Log({
          filter: {paramGoalID: _goalid, paramStravaID: Cookies.get('stravaID'), finisher: true },
          fromBlock: 0, toBlock: 'latest'
        }, function(error, event){ 
            //do some stuff
            //ex. usdPayout = parseInt(event.returnValues._payout);

            Swal.fire({
              title: 'That workout was so worth it...',
              icon: 'success',
              html: Cookies.get('stravaUsername')+ ', you just just earned '+event.returnValues._payout+' '+TOKENSYMBOL+ ' for this workout!'
            });

            telegramNotify(playerName+' just earned '+event.returnValues._payout+' '+TOKENSYMBOL+ ' for their workout!', 'false');

            if(event.returnValues.finisher != false) {
              Swal.fire({
              title: 'You are a top finisher!',
              icon: 'warning',
              text: 'You are one of the first three to finish this challenge. Go see the '+companyName+'admin for your extra prize!'
            });
            }
          }
        ).on('error', console.error);

      }
      else{
        $("#logLoader").hide();
        $("#redeem").hide();
        console.error("redeem error");
      } 
    }
  ).once('error', function(error){console.log(error);});
}

///////////////////////////////////////
//////////////^^^^^^^ nceno.log()
///////////////////////////////////////


