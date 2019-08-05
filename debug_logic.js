//get test ether that is stored in the contract
function getTestETH(){
  Nceno.methods.getTestETH()
  .send({from: web3.eth.defaultAccount, gas: 1500000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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
      updateNonce();
    }
    else{
      console.log("error...");
    } 
  }).once('error', function(error){console.log(error);});
}

//datepicker initializer
var first = new Date();
first.setDate(first.getDate() + 1);
//$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$('[data-toggle="datepicker"]').datepicker({'autoHide': true});
$("#time").click(function(){
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  console.log(time);
})

var correctNonce = 0;
function updateNonce(){
  web3.eth.getTransactionCount(web3.eth.defaultAccount).then(nonce => {
    correctNonce = nonce;
  });
  console.log("nonce is: "+correctNonce);
}

var portisEmail;
//signs user into portis and stores their wallet address as the default wallet address in web3
function showPortis() {

  $('#portisLoader').show();
  setTimeout("$('#portisLoader').hide();", 5000);

  // will only open the portis menu
  portis.showPortis(() => {
    
  });

  
  portis.onLogin((walletAddress, email) => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      console.log("default: " + web3.eth.defaultAccount);
      portisEmail = email;
      console.log("portis email is: "+ portisEmail);
      localize();
      getToken();
      $("#portisBtn").hide();
      updateGasPrice();

      //$("#portisSuccess").html('<a style="color:white;">Wallet address: </a>'+web3.eth.defaultAccount.slice(0, 22)+' '+web3.eth.defaultAccount.slice(23, 42));
      $("#portisSuccess").html('<h5><a style="color:#ffffff;">Blockchain connection: </a></h5><a style="color:#ccff00;">successful!</a>');
      $("#openWallet").show();
      
    });
  });
}

//helper function that will hide the create account button if the user already made an account.
//i.e. if a fitbit ID already has a competitor object associated to it, this function hides the create button.
function checkUserbase(){
  localize();

  Nceno.methods.userExists(
    stravaID
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        if(result){
          $("#makeAcctBtn").hide();
        }
        //else
      }
      else
      console.error(error);
    }
  );
}

//sanity check for debugging
console.log(Nceno);

//hides all the loaders
$("#createBtn").hide();
$("#acctLoader").hide();
$("#acctSuccess").hide();
$("#createLoader").hide();
$("#createSuccess").hide();
$("#dashboard").hide();
$("#logLoader").hide();
$("#logSuccess").hide();
$("#claimLoader").hide();
$("stravaSuccess").hide();
$("stravaOk").hide();
$("portisSuccess").hide();
$("#request").hide();
$("#joinLoader").hide();
//$("#joinSuccess").hide();
$("#joinSoonLoader").hide();
//$("#joinSoonSuccess").hide();
$("#makeAcctBtn").hide();
$("#openWallet").hide();
$("#portisLoader").hide();
$("#hostBtn").hide();
$("#joinSearch").hide();
$('#joinSoonModalBtn').hide();
$("#claimBtn").show();

$('#btnU1').hide();
$('#btnU2').hide();
$('#btnU3').hide();
$('#btnU4').hide();
$('#btnU5').hide();
$('#btnU6').hide();
$('#btnU7').hide();
$('#btnU8').hide();
$('#btnU9').hide();
$('#btnU10').hide();

$('#w1log').hide();
$('#w1claim').hide();
$('#w2log').hide();
$('#w2claim').hide();
$('#w3log').hide();
$('#w3claim').hide();
$('#w4log').hide();
$('#w4claim').hide();
$('#w5log').hide();
$('#w5claim').hide();
$('#w6log').hide();
$('#w6claim').hide();
$('#w7log').hide();
$('#w7claim').hide();
$('#w8log').hide();
$('#w8claim').hide();
$('#w9log').hide();
$('#w9claim').hide();
$('#w10log').hide();
$('#w10claim').hide();
$('#w11log').hide();
$('#w11claim').hide();
$('#w12log').hide();
$('#w12claim').hide();

$('#week1').hide();
$('#week2').hide();
$('#week3').hide();
$('#week4').hide();
$('#week5').hide();
$('#week6').hide();
$('#week7').hide();
$('#week8').hide();
$('#week9').hide();
$('#week10').hide();
$('#week11').hide();
$('#week12').hide();

//timestamps are in this format: yyyymmddT160000Z
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
function reminder(_target, _stake, _minutes, _frequency, _duration, _goalid, _start){
  //need to convert these times

  var s = new Date(_start*1000).toISOString();
  //.000, -, :
  var start = s.replace(/:/g, "").replace(/-/g, "").replace(".000", "");
  var e = new Date(1000*(_start+_duration*604800)).toISOString();
  var end = e.replace(/:/g, "").replace(/-/g, "").replace(".000", "");
  $('#'+_target).html('<a style="color:#ccff00;" target= "_blank" href ="https://www.google.com/calendar/r/eventedit?text=My%20Nceno%20goal&location=www.nceno.app/app.html&details=You%20committed%20$' + _stake + '%20to%20working%20out%20for%20' + _minutes + 'min,%20'+ _frequency+ 'x%20per%20week,%20for%20'+ _duration + '%20weeks.%20The%20challenge%20ID%20is%20'+_goalid+'.&dates='+start+'/'+end+'">Add to Google Calendar</a>');
}

//shares the challenge to strava automatically
function stravaShare(_start, _minutes, _stake, _frequency, _weeks, _goalid){
  var challengeStart = new Date(_start*1000).toDateString();
  var startDateLocal = new Date().toISOString(); //need to convert from UTC to local timezone.... will not affect the challenge.

  var nameString = '$'+_stake+'... Anyone wanna join me?';
  var descriptionString = 'I’m hosting a challenge worth $'+_stake+ ' to workout for '+_minutes+'mins, '+_frequency+'x per week, for '+_weeks+' weeks. If you wanna join me, go to www.nceno.app/app and search for challenge ID "'+_goalid+'". It starts on '+ challengeStart+'.';

  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function(){
    if (this.readyState === 4) {
        console.log(this.responseText);
        var data = JSON.parse(xhr.responseText);
        console.log("shared to strava.");
    }
  });
  xhr.open("POST", 'https://www.strava.com/api/v3/activities?name='+nameString+'&type=Workout&start_date_local='+startDateLocal+'&elapsed_time='+_minutes*60+'&description='+descriptionString);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}

//show create button only if user agrees to terms
$("#checker").on('click', function() {
if($("#checker").is(':checked')) {
  $("#createBtn").show(); 
} else {
  $("#createBtn").hide(); 
  }
});

//global variables for when a user auths with strava
//var fitbitUser 
var userID

//a clue to load the join or log/claim txn with the right ID or week....... needs work.        
function loadRowID(){
  var id = $("button").closest("div").prop("id");
}

//creating a competitor account from the input form and flag
$("#makeAcctBtn").click(function() {
  localize();
  Nceno.methods.makeProfile(
    stravaID,
    web3.utils.padRight(web3.utils.toHex(stravaUsername),34),
    web3.utils.padRight(web3.utils.toHex(flag),34),
    OS)
  .send({from: web3.eth.defaultAccount, gas: 1500000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){

        $("#makeAcctBtn").hide();
        $("#acctLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){ 
    console.log(receipt.status);
    if(receipt.status === true){
      updateNonce();
      $("#acctLoader").hide();
      $("#makeAcctBtn").hide();
    }
    else{
      $("#acctLoader").hide();
      $("#makeAcctBtn").hide();
      $('#acctFail').html('<p>Transaction failed. That profile already exists!</p>');
      console.log("profile already exists!");
    } 
  }).once('error', function(error){console.log(error);});
});


//randomizes the goalID
function randGoalID(){
  goalID = web3.utils.padRight(web3.utils.randomHex(3),6);
}

//creating a goal from the slider values and live ethereum price
var goalID = web3.utils.padRight(web3.utils.randomHex(3),6);
$("#hostBtn").click(function() {
  //updateEthPrice();
  var sliderStake = $("#sliderStake").roundSlider("getValue").toString();
  var msgValueHost = 1000100000000000000*$("#sliderStake").roundSlider("getValue")/ethPrice; //removed math.floor()
  var usdStakeInWei = msgValueHost.toString();
  var start = new Date($("#dateChoice").datepicker('getDate')).getTime() / 1000;

  Nceno.methods.host(
    goalID,
    $("#sliderMins").roundSlider("getValue"),
    sliderStake, //plain whole dollar amount
    $("#sliderSes").roundSlider("getValue"),
    $("#sliderWks").roundSlider("getValue"),
    start,
    stravaID,
    Math.round(ethPrice*100), //eth price in pennies. Gets rid of decimals
    web3.utils.toHex($('#promoField').val())
  )
  .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 4500000, gasPrice: Math.ceil(gasPriceChoice)*1000000000, value: usdStakeInWei},
    function(error, result) {
      if (!error){
        $("#hostBtn").hide();
        $("#cancelBtn").hide();
        $("#createLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){
    console.log(receipt.status);
    if(receipt.status === true){
      correctNonce++;
      $("#createLoader").hide();
      $("#createSuccess").show();
      $("#chalID").html("Invite your friends to this challenge! The challenge ID is: "+ goalID+".");
      reminder('createReminder',sliderStake, $("#sliderMins").roundSlider("getValue"), $("#sliderSes").roundSlider("getValue"), $("#sliderWks").roundSlider("getValue"), goalID, start);
      stravaShare(start, $("#sliderMins").roundSlider("getValue"), sliderStake, $("#sliderSes").roundSlider("getValue"), $("#sliderWks").roundSlider("getValue"), goalID);
    }
    else{
      $("#createLoader").hide();
      $("#hostBtn").hide();
      $('#createFail').html('<p>Transaction failed. User account does not exist, or else message value is less than intended stake.</p>');
      console.log("User does not exist, or else message value is less than intended stake.");
    }
    })
    .once('error', function(error){console.log(error);});;
});

//gets the user's operating system
var OS = 0;
function getMobileOS() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    OS = 3;
    console.log("OS is: Windows Phone");
  }
  else if (/android/i.test(userAgent)) {
    OS = 2;
    console.log("OS is: Android");
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    OS = 1;
    console.log("OS is: iOS");
  }
  else console.log("OS is: unknown");
}

//function that displays in a modal, a summary of the goal you are setting.
var ethPrice;
function echoGoal(){
  //get live eth price
  updateEthPrice('hostBtn');
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  //echo modal
  $("#host").tab('show');
  $('#popupCreate').modal('show');

  $("#goalEcho").html(
    "You're commiting $" + $("#sliderStake").roundSlider("getValue") + " to working out for " + 
    $("#sliderMins").roundSlider("getValue") +"mins " + $("#sliderSes").roundSlider("getValue")+" times per week for "+ 
    $("#sliderWks").roundSlider("getValue")+  " weeks, starting automatically on "+ $("#dateChoice").datepicker('getDate', true) +"."
  );
}


//joins the searched goal
function joinSearch(){
  goalid = web3.utils.padRight($('#searchField').val(),34);
  Nceno.methods.join(
    goalid,
    stravaID,
    Math.floor(ethPrice*100),
    web3.utils.toHex($('#promoFieldSearch').val())
  )
  //subsidized joining fee with "value: stakewei - 1200400*gasPrice"
  .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 3500000, gasPrice: Math.ceil(gasPriceChoice)*1000000000, value: stakeweiSearched - 0},
    function(error, result) {
      if (!error){
        $("#joinSearch").hide();
        $("#joinLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){ 
    console.log(receipt.status);
    if(receipt.status === true){
      correctNonce++;
      $("#joinLoader").hide();
      $("#joinSuccess").html('<p>You’re in the challenge! Don’t forget to mark the starting time in your calendar!</p>');
      //need the join serach button to set proper global variables and then these functions can reference them
      reminder('srJoinReminder', _stake, _minutes, _frequency, _duration, _goalid, _start);
      stravaShare(_start, _minutes, _stake, _frequency, _duration, _goalid);
    }
    else{
      
      $("#aboutToJoin").hide();
      $("#srEcho").html('');
      $("#joinLoader").hide();
      $("#joinFail").html('<p>Cannot join. Either the challenge already started, or else you are already in this challenge. Go check your upcoming goals! (ID: '+goalid.slice(0, 7)+')</p>');
      console.log("Challenge already started, user already is a participant, or else message value is less than intended stake.");
    } 
  }).once('error', function(error){console.log(error);}); 
}



//an abortion of a function that should populate the dropdown with upcoming, active, and completed goals. Needs work.
var populated = false;
function makeList(){
  $("#goalCategories").selectric();
  if(populated === false){
    var goals1 = new Array();
    var goals2 = new Array();
    var goals3 = new Array();

    for (let i = 0; i < 15; i++){
      //upcoming
      Nceno.methods.getUpcomingGoal(stravaID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals1[i] = result;
          console.log(goals1[i] + " is an upcoming goal");
          
          $("#upcomingGoals").after('<option>'+ goals1[i].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });
      //active
      Nceno.methods.getActiveGoal(stravaID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals2[i] = result;
          console.log(goals2[i]  + " is an active goal");
          
          $("#activeGoals").after('<option>'+ goals2[i].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });
      //completed
      Nceno.methods.getCompletedGoal(stravaID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals3[i] = result;
          console.log(goals3[i]  + " is a completed goal");
          
          $("#completedGoals").after('<option>'+ goals3[i].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });  
    }
    populated=true;
  }
  
}

function resetCreate(){
  $("#hostBtn").show();
  $("#cancelBtn").show();
  $("#createSuccess").hide();
  $("#createLoader").hide();
  $("#createReminder").html('');
  $("#createFail").html('');
  randGoalID();
  $("#chalID").html('');
}
$('#popupCreate').on('hidden.bs.modal', function (e) {
  resetCreate();
})

function resetLog(){
  $("#payMeBtn").show();
  $("#logSuccess").html('');
  $("#logFail").html('');
  $("#logEcho").html('');
  $("#getYouPaid").show();
  $("#logLoader").hide();
}
$('#logModal').on('hidden.bs.modal', function (e) {
  resetLog();
})

function resetClaim(){
  $("#claimBtn").show();
  $("#claimSuccess").html('');
  $("#claimFail").html('');
  $("#claimTitle").show();
  $("#claimLoader").hide();
}
$('#claimModal').on('hidden.bs.modal', function (e) {
  resetClaim();
})

function resetJoinSr(){
  $("#joinSearch").show();
  $("#joinSuccess").html('');
  $("#joinFail").html('');
  $("#aboutToJoin").show();
  $("#srEcho").html('');
  $("#srJoinReminder").html('');
  $("#joinLoader").hide();
}
$('#popupSrJoin').on('hidden.bs.modal', function (e) {
  resetJoinSr();
})

function resetJoinSoon(){
  $("#joinSoonModalBtn").show();
  $("#soonEcho").html('');
  $("#joinSoonSuccess").html('');
  $("#joinSoonFail").html('');
  $("#soonJoinTitle").show();
  $("#joinSoonReminder").html('');
  $("#joinSoonLoader").hide();
  $('#promoFieldSoon').show();
}
$('#popupSoonJoin').on('hidden.bs.modal', function (e) {
  resetJoinSoon();
})

//helper function that populates the manage page with all the goodies. needs work.
function makePage(){
  makeList();
  selectedChallenge();
  updateNonce();
  //quickStats();
  getToken();
}

var wkLimit = 0;
var currentWeek = 0;
function makeWktl(_claimStatus){
  //hide all weeks and buttons, in case previously selected goal was longer.
  for (let i = 0; i < 12; i++){
    var wkindex = i+1;
    var currentwkHide = 'week'+wkindex;
    var currentwklogHide  = 'w'+wkindex+'log';
    var pastwkclaimHide  = 'w'+wkindex+'claim';
    $('#'+currentwkHide).hide();
    $('#'+currentwklogHide).hide();
    $('#'+pastwkclaimHide).hide();
  }

  var pastWeek = currentWeek-1;
  var currentwklogKey  = 'w'+currentWeek+'log';
  var pastwkclaimKey  = 'w'+pastWeek+'claim'; 

  if(currentWeek<=wkLimit){
    $('#'+currentwklogKey).show();
  }
 if(currentWeek<=wkLimit+1 && _claimStatus === false){
    $('#'+pastwkclaimKey).show();
  }
 
  var mostRecentWk = 0;
  if(currentWeek>wkLimit){mostRecentWk = wkLimit;}
  else mostRecentWk = currentWeek;

  for (let i = 0; i < mostRecentWk; i++){ //i < wkLimit;
    var wkindex = i+1;
    var currentwkKey = 'week'+wkindex;
    $('#'+currentwkKey).show();
  }
}

var goalid;
function selectedChallenge(){
  // Initialize Selectric and bind to 'change' event
  $('#goalCategories').selectric().on('change', function() {
    goalid = web3.utils.padRight($('#goalCategories').val(),34);
    console.log("selected goal is: "+goalid);

    var hasClaimed = false;
/*    //-----hiding the claim button
    Nceno.methods.seeClaims(
      stravaID,
      goalid
    )
    .call({from: web3.eth.defaultAccount},
      function(error, result) {
        if (!error){
          if(result === 1){
            hasClaimed = true;
          }
          //else
        }
        else
        console.error(error);
      }
    );
    //----/hiding the claim button*/

    var sessions = 0;
    var wks = 0;
    var USDstake = 0;
    var competitors = 0;

    //try making these dictionaries instead
    var wkPayout = {};
    var wkBonus = {};
    
    
    var lockedPercentWk = new Array();
    var successesWk = new Array();
    var winnersWk = new Array();
    var startingTime = 0;

    //empty previous charts
    var ctx1 = null;
    var ctx2 = null;

    $('#canvas1Div').html('');
    $('#canvas2Div').html('');


    //overwrite artifacts from perviously selected goal if current has lower compcount.
    for (let k = 0; k < 10; k++){
      var n = k+1;
      var adhKey = 'adhP'+n;
      var nameKey = 'nameP'+n;
      var flagKey = 'flagP'+n;
      var bonusKey = 'bonusP'+n;
      var payKey = 'payP'+n;
      var lostKey = 'lostP'+n;
      var dlKey1 = 'dl'+n;
                        
      $('#'+adhKey).html('');
      $('#'+nameKey).html('');
      $('#'+flagKey).html('');
      $('#'+bonusKey).html('');
      $('#'+payKey).html('');
      $('#'+lostKey).html('');
      $('#'+dlKey1).html('');

    }

    Nceno.methods.getGoalParams(goalid)
    .call({from: web3.eth.defaultAccount},
        async function(error, result) {
        if (!error){
          //echo challenge
          var compcount = result[5];
          var tstamp = new Date(result[4]*1000);
          startingTime = result[4]*1.0;
          wkLimit = result[3];
          $("#echStake").html("$"+result[1]);
          $("#echWks").html(result[3]+" wks");
          $("#echSes").html(result[2]+" x/wk");
          $("#echMins").html(result[0]+ " mins");
          $("#echComp").html(result[5]);
          $("#echStart").html(tstamp.toDateString());
          $("#dashboard").show();


          //set the timeline variables
          sessions = result[2];
          USDstake = result[1];
          competitors = result[5];
          wks = result[3];

          //set current challenge week globally
          currentWeek = Math.floor((Date.now()/1000 - startingTime)/604800)+1;
          if(Date.now()/1000 < (startingTime+wkLimit*604800)){
            chartWeek = currentWeek;
          }
          else {chartWeek = wkLimit;}
          //currentWeek = (Date.now()/1000 - result[4])/604800;
          console.log("blockchain says we're in week: "+currentWeek);
          makeWktl(hasClaimed);
       
          await Nceno.methods.getParticipants(goalid)
          .call({from: web3.eth.defaultAccount},
            async function(error, result) {
              if (!error){
                
                var ids = new Array();
                var names = new Array();
                var flags = new Array();
                
                ids = result[0];
                names = result[1];
                flags = result[2];


      //////////////// warning: do you mean to call a for loop on the nested function as well?
                for (let k = 0; k < compcount; k++){

                  await Nceno.methods.getMyGoalStats1(ids[k], goalid)
                  .call({from: web3.eth.defaultAccount},
                    async function(error, result) {
                      if (!error){
                        
                        var adherence = new Array();
                        adherence[k] = result[0];

                        await Nceno.methods.getMyGoalStats2(ids[k], goalid)
                        .call({from: web3.eth.defaultAccount},
                          async function(error, result) {  
                            if (!error){
                              var bonusTotal = new Array();
                              var totalPay = new Array();
                              var lostStake = new Array();

                              bonusTotal[k] = (result[3]*1).toFixed(2);
                              totalPay[k] = (result[4]/100).toFixed(2);

                              if(currentWeek>1){
                                lostStake[k] = (result[1]/100).toFixed(2);
                              }
                              else lostStake[k] = (0).toFixed(2);


                              wkBonus[ids[k]] = result[2];
                              wkPayout[ids[k]] = result[0];

                              var convertedName = web3.utils.hexToUtf8(names[k]);
                              var convertedFlag = web3.utils.hexToUtf8(flags[k]).toLowerCase();

                              var n = k+1;
                              var adhKey = 'adhP'+n;
                              var nameKey = 'nameP'+n;
                              var flagKey = 'flagP'+n;
                              var bonusKeyL = 'bonusP'+n;
                              var payKey = 'payP'+n;
                              var lostKey = 'lostP'+n;                            

                              //0% success error root...
                              $('#'+adhKey).html(adherence[k]+'%');
                              $('#'+nameKey).html(convertedName);
                              $('#'+flagKey).html('<img src="https://ipdata.co/flags/'+convertedFlag+'.png">');
                              $('#'+bonusKeyL).html('+$'+(bonusTotal[k]/1000000000000000000).toFixed(2));
                              $('#'+payKey).html('$'+totalPay[k]);
                              $('#'+lostKey).html('-$'+lostStake[k]);

                                //get the timeline variables and set them
                                await Nceno.methods.getGoalArrays(goalid, stravaID)
                                .call({from: web3.eth.defaultAccount},
                                  function(error, result) {
                                    if (!error){
                                      lockedPercentWk = result[0];
                                      
                                      //hide the current locked stake percent from the user
                                      if(currentWeek>1){
                                        visibleLockedPercentWk = lockedPercentWk.slice(0, currentWeek-1);
                                      }
                                      else(visibleLockedPercentWk=[0])

                                      successesWk = result[1];
                                      winnersWk = result[2];

                                        
                                      //populate the timeline

                                      /*var wkPointer;
                                      if(currentWeek>wkLimit){wkPointer=wkLimit;}
                                      else wkPointer=currentWeek;*/

                                      for (let k = 0; k < currentWeek; k++){
                                        var n = k+1;
                                        var dlKey = 'dl'+n;
                                        var complKey = 'compl'+n;
                                        var lockKey = 'lock'+n;
                                        var bonusKey = 'bonus'+n;
                                        var unKey = 'un'+n;
                                        var finKey = 'fin'+n;
                                        var lost = 0;

                                        //this inequality makes the NaN error.... 
                                        if(currentWeek > k+1){
                                          lost = (lockedPercentWk[k]*USDstake-wkPayout[stravaID][k])/100;
                                        }
                                        else lost = 0;
                                        nowTime = Math.floor(new Date().getTime()/1000);
                                        daysRem = Math.ceil((startingTime + wks*604800 - nowTime - (wks-currentWeek)*604800)/86400);

                                        if(k+1 == currentWeek){
                                          if(daysRem!=1){
                                            $('#'+dlKey).html('<h3><b style="color:#ccff00;">'+daysRem+"</b> days left this week</h3>");
                                          }
                                          else{$('#'+dlKey).html('<h2>Last day this week!</h2>');}
                                        }

                                        $('#'+complKey).html(successesWk[k] +" of "+ sessions);

                                        //hide locked stake from user
                                        if(k+1 == currentWeek){
                                          $('#'+lockKey).html("$???");
                                        }
                                        else $('#'+lockKey).html("$"+(lockedPercentWk[k]*USDstake/100).toFixed(2));
                                        
      /////////////////////////////////
      //this will error when user's stravaID is lower in the list than where the loop is at
      //because bonusKey is updated before this function.
      //need to test...
      /////////////////////////////////
                                        $('#'+bonusKey).html("$" +(wkBonus[stravaID][k]/100).toFixed(2));
                                        $('#'+unKey).html("$" +(wkPayout[stravaID][k]/100).toFixed(2));
      /////////////////////////////////

                                        //$('#'+finKey).html(winnersWk[k] +" of "+ competitors);
                                        $('#'+finKey).html("$" +lost.toFixed(2));

                                        //disallow logging and claiming if quotas are met
                                        if(k>0 && successesWk[k-1] != sessions){
                                          $('#w'+k+'claim').hide();
                                        }

                                        if(successesWk[k] === sessions){
                                          var m = k+1;
                                          $('#w'+m+'log').hide();
                                        }
                                      }

                                      //make chart data 
                                      //x axis
                                      var xaxis = new Array();
                                        for(let i = 0; i<chartWeek; i++){
                                        var weekIndex = i+1;
                                        xaxis[i] = "Week "+weekIndex;
                                      }

                                      //Cumulative % stake returned
                                      var roi = new Array();
                                      for(let i = 0; i<wks; i++){
                                        var sum = 0;
                                        for(let k = 0; k<i+1; k++){
                                          sum += Math.round(0.1*(wkPayout[stravaID][k]+wkBonus[stravaID][k])/(USDstake));
                                        }
                                        roi[i] = sum;
                                      }

                                      //% Competitors finished the week
                                      var finishers = new Array();
                                      for(let i = 0; i<wks; i++){
                                        finishers[i] = winnersWk[i]*100/competitors;
                                      }

                                      $('#canvas1Div').html('<canvas id="canvas1" ></canvas>');
                                      $('#canvas2Div').html('<canvas id="canvas2" ></canvas>');  

                                      //draw charts**************************************************************************************************
                                      ctx1 = document.getElementById('canvas1').getContext('2d');
                                      window.myLine1 = new Chart(ctx1, 
                                        //config1
                                        {
                                          type: 'bar',
                                          data: {
                                            datasets: [{
                                                //bar
                                                label: 'Workouts you completed',
                                                yAxisID: 'A',
                                                //data: [3, 3, 2, 3, 1, 0, 3, 1, 3, 3, 2, 3],
                                                data: successesWk,
                                                backgroundColor: 'rgba(204, 255, 0, 0.5)',

                                                borderColor: '#ccff00',
                                                fill: true
                                            }, {
                                                //line
                                                label: '% Competitors finished the week',
                                                yAxisID: 'B',
                                                //data: [90, 95, 60, 40, 55, 70, 30, 45, 40, 30, 20, 43],
                                                data: finishers,
                                                type: 'line',
                                                backgroundColor: 'rgba(244, 66, 179, 0.5)',
                                                borderColor: '#f442b3',
                                                fill: true
                                            }],
                                            //labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
                                            labels: xaxis
                                          },
                                          


                                          options: {
                                            responsive: true,
                                            legend: {
                                              position: 'bottom',
                                            },
                                            hover: {
                                              mode: 'index'
                                            },
                                            scales: {
                                              xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                  display: true,
                                                  labelString: 'Week'
                                                }
                                              }],

                                              yAxes: [
                                                {
                                                  //bar axis
                                                  id: 'A',
                                                  type: 'linear',
                                                  position: 'left',
                                                  ticks: {
                                                    beginAtZero: true
                                                  },
                                                  scaleLabel: {
                                                    display: true,
                                                    labelString: 'Workouts'
                                                  }
                                                  },
                                                {
                                                  //line axis
                                                  id: 'B',
                                                  type: 'linear',
                                                  position: 'right',
                                                  ticks: {
                                                    beginAtZero: true
                                                  },
                                                  scaleLabel: {
                                                    display: true,
                                                    labelString: '% competitors'
                                                  }
                                                }
                                              ],

                                              gridlines: [{
                                              display: true,
                                              color: '#848484'
                                              }]
                                            },
                                            title: {
                                              display: true,
                                              text: 'Your Progress'
                                            }
                                          }
                                        }
                                      );

                                      ctx2 = document.getElementById('canvas2').getContext('2d');
                                      window.myLine2 = new Chart(ctx2, 
                                        //config2
                                        {
                                          type: 'bar',
                                          data: {
                                            datasets: [{
                                                //bar data
                                                label: '% stake locked up',
                                                yAxisID: 'A',
                                                //data: [2, 5, 7, 5, 9, 15, 10, 3, 8, 18, 11, 7],
                                                data: visibleLockedPercentWk,
                                                backgroundColor: 'rgba(204, 255, 0, 0.5)',
                                                borderColor: '#ccff00',
                                                fill: true
                                            }, 

                                            {
                                                //line data
                                                label: 'Your cumulative % stake earned back',
                                                yAxisID: 'B',
                                                //data: [2, 7, 12, 26, 26, 30, 45, 45, 78, 85, 85, 90],
                                                data: roi,
                                                backgroundColor: 'rgba(244, 66, 179, 0.5)',
                                                borderColor: '#f442b3',
                                                fill: true,
                                                type: 'line'
                                            }],
                                            //labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
                                            labels: xaxis
                                          },
                                          


                                          options: {
                                            responsive: true,
                                            legend: {
                                              position: 'bottom',
                                            },
                                            hover: {
                                              mode: 'index'
                                            },
                                            scales: {
                                              xAxes: [{
                                                display: true,
                                                scaleLabel: {
                                                  display: true,
                                                  labelString: 'Week'
                                                }
                                              }],

                                              yAxes: [
                                                {
                                                  //bar axis
                                                  id: 'A',
                                                  type: 'linear',
                                                  position: 'left',
                                                  ticks: {
                                                    beginAtZero: true
                                                  },
                                                  scaleLabel: {
                                                    display: true,
                                                    labelString: '% stake'
                                                  }
                                                  },
                                                {
                                                  //line axis
                                                  id: 'B',
                                                  type: 'linear',
                                                  position: 'right',
                                                  ticks: {
                                                    beginAtZero: true
                                                  },
                                                  scaleLabel: {
                                                    display: true,
                                                    labelString: '% returned'
                                                  }
                                                }
                                              ],

                                              gridlines: [{
                                              display: true,
                                              color: '#848484'
                                              }]
                                            },
                                            title: {
                                              display: true,
                                              text: 'Challenge Snapshot'
                                            }
                                          }
                                        }
                                      );
                                      
                                      //***************************************************************************

                                    }
                                    else{
                                      console.log("step 5/5 getGoalArrays failed.");  
                                      console.error(error);
                                    }
                                });
                              //}//end if

                              //we place this outside of the function so that the order of our specific ID doesn;t matter. Its key will be defined in the list always.
                              for (let k = 0; k < currentWeek; k++){
                                var n = k+1;
                                var bonusKey = 'bonus'+n;
                                var unKey = 'un'+n;
                                $('#'+bonusKey).html("$" +(wkBonus[stravaID][k]/1000000000000000000).toFixed(2));
                                $('#'+unKey).html("$" +(wkPayout[stravaID][k]/100).toFixed(2));
                              }
                              
                            }
                            else{
                              console.log("step 4/5 getGoalStats2 failed.");  
                              console.error(error);
                            }
                        });
                      }
                      else{
                        console.log("step 3/5 getGoalStats1 failed.");  
                        console.error(error);
                      }
                  });
                }
              }
              else{
                console.log("step 2/5 got participants failed.");  
                console.error(error);
              }
          });
          
        } 
        else{
          console.log("step 1/5 getGoalParams failed.");  
          console.error(error);
        }
    });
  });
}


//searches for a specific goal and displays it with an option to join.
//also populates the join modal.
var stakeweiSearched;
function search(){
  updateEthPrice('joinSearch');
  $("#request").show();
  var goalid = web3.utils.padRight($('#searchField').val(),34)

  Nceno.methods.getGoalParams(goalid)
  .call({from: web3.eth.defaultAccount},
      function(error, result) {
      if (!error){
        //echo challenge

        var tstamp = new Date(result[4]*1000);
        //var buyin = Math.round(result[1]*result[5]/100000000000000000000);
        stakeweiSearched = 1000100000000000000*result[1]/ethPrice;
        $("#srStake").html("$"+result[1]);
        $("#srWks").html(result[3]+" wks");
        $("#srSes").html(result[2]+" x/wk");
        $("#srMins").html(result[0]+ " mins");
        $("#srComp").html(10-result[5]);
        $("#srStart").html(tstamp.toDateString());
        if(result[4]*1000>Date.now()){$("#srJoin").show();}

        $("#srEcho").html(
          "You're commiting $" + result[1] + " to working out for " + 
          result[0] +"mins " + result[2]+" times per week for "+ 
          result[3]+  " weeks, starting automatically on "+ tstamp.toDateString()
        );
      }
      else
      console.error(error);
  }); 
}

//populates the challenges starting soon table

var targetGoalID;
var targetStake;
var targetWks;
var targetSes;
var targetMin;
var targetStart;

async function browse(){
  updateNonce();
  //clear out the goalIDs from old elements
  $('#idNumberU1').val('');
  $('#idNumberU2').val('');
  $('#idNumberU3').val('');
  $('#idNumberU4').val('');
  $('#idNumberU5').val('');
  $('#idNumberU6').val('');
  $('#idNumberU7').val('');
  $('#idNumberU8').val('');
  $('#idNumberU9').val('');
  $('#idNumberU10').val('');

  
  for (let i = 0; i < 10; i++){
    var result = await Nceno.methods.getFutureGoal(i).call({from: web3.eth.defaultAccount});


    if(result[0] != 0x0000000000000000000000000000000000000000000000000000000000000000 && result[0] != undefined){
      //list it in the table
      var tstamp = new Date(result[5]*1000);
      //var buyin = Math.round(result[2]/100000000000000000000);
      var n = i+1;
      var buyinKey = 'buyinU'+n;
      var wksKey = 'wksU'+n;
      var sesKey = 'sesU'+n;
      var minKey = 'minU'+n;
      var pplKey = 'pplU'+n;
      var startKey = 'startU'+n;
      var btnKey = 'btnU'+n;
      var idKey = 'idNumberU'+n;
      $('#'+buyinKey).html('$'+result[2]);
      $('#'+wksKey).html(result[4]+'  wks');
      $('#'+sesKey).html(result[3]+' x/wk');
      $('#'+minKey).html(result[1]+'  min');
      $('#'+pplKey).html(10-result[6]);
      $('#'+startKey).html(tstamp.toDateString());
      $('#'+btnKey).show();
      $('#'+idKey).hide();
      $('#'+idKey).html(result[0]+'');
      console.log("upcoming goal: "+result[0]);      
    }   
  }
}
//must be outside, so accessible globally.
$('#soonJoin1').click(function(){
    targetGoalID = $('#idNumberU1').text();
    targetStake = $('#buyinU1').text().slice(1);
    targetWks = $('#wksU1').text().slice(0,3);
    targetSes = $('#sesU1').text().slice(0,2);
    targetMin = $('#minU1').text().slice(0,3);
    targetStart = $('#startU1').text();
    targetStartStamp =$('#startU1');
    populateTargetModal();
  });
  $('#soonJoin2').click(function(){
    targetGoalID = $('#idNumberU2').text();
    targetStake = $('#buyinU2').text().slice(1);
    targetWks = $('#wksU2').text().slice(0,3);;
    targetSes = $('#sesU2').text().slice(0,2);
    targetMin = $('#minU2').text().slice(0,3);
    targetStart = $('#startU2').text();
    targetStartStamp =$('#startU2');
    populateTargetModal();
  });
  $('#soonJoin3').click(function(){
    targetGoalID = $('#idNumberU3').text();
    console.log("target goal ID is: "+targetGoalID);
    targetStake = $('#buyinU3').text().slice(1);
    targetWks = $('#wksU3').text().slice(0,3);;
    targetSes = $('#sesU3').text().slice(0,2);
    targetMin = $('#minU3').text().slice(0,3);
    targetStart = $('#startU3').text();
    targetStartStamp =$('#startU3');
    populateTargetModal();
  });
  $('#soonJoin4').click(function(){
    targetGoalID = $('#idNumberU4').text();
    targetStake = $('#buyinU4').text().slice(1);
    targetWks = $('#wksU4').text().slice(0,3);;
    targetSes = $('#sesU4').text().slice(0,2);
    targetMin = $('#minU4').text().slice(0,3);
    targetStart = $('#startU4').text();
    targetStartStamp =$('#startU4');
    populateTargetModal();
  });
  $('#soonJoin5').click(function(){
    targetGoalID = $('#idNumberU5').text();
    targetStake = $('#buyinU5').text().slice(1);
    targetWks = $('#wksU5').text().slice(0,3);;
    targetSes = $('#sesU5').text().slice(0,2);
    targetMin = $('#minU5').text().slice(0,3);
    targetStart = $('#startU5').text();
    targetStartStamp =$('#startU5');
    populateTargetModal();
  });
  $('#soonJoin6').click(function(){
    targetGoalID = $('#idNumberU6').text();
    targetStake = $('#buyinU6').text().slice(1);
    targetWks = $('#wksU6').text().slice(0,3);;
    targetSes = $('#sesU6').text().slice(0,2);
    targetMin = $('#minU6').text().slice(0,3);
    targetStart = $('#startU6').text();
    targetStartStamp =$('#startU6');
    populateTargetModal();
  });
  $('#soonJoin7').click(function(){
    targetGoalID = $('#idNumberU7').text();
    targetStake = $('#buyinU7').text().slice(1);
    targetWks = $('#wksU7').text().slice(0,3);;
    targetSes = $('#sesU7').text().slice(0,2);
    targetMin = $('#minU7').text().slice(0,3);
    targetStart = $('#startU7').text();
    targetStartStamp =$('#startU7');
    populateTargetModal();
  });
  $('#soonJoin8').click(function(){
    targetGoalID = $('#idNumberU8').text();
    targetStake = $('#buyinU8').text().slice(1);
    targetWks = $('#wksU8').text().slice(0,3);;
    targetSes = $('#sesU8').text().slice(0,2);
    targetMin = $('#minU8').text().slice(0,3);
    targetStart = $('#startU8').text();
    targetStartStamp =$('#startU8');
    populateTargetModal();
  });
  $('#soonJoin9').click(function(){
    targetGoalID = $('#idNumberU9').text();
    targetStake = $('#buyinU9').text().slice(1);
    targetWks = $('#wksU9').text().slice(0,3);;
    targetSes = $('#sesU9').text().slice(0,2);
    targetMin = $('#minU9').text().slice(0,3);
    targetStart = $('#startU9').text();
    targetStartStamp =$('#startU9');
    populateTargetModal();
  });
  $('#soonJoin10').click(function(){
    targetGoalID = $('#idNumberU10').text();
    targetStake = $('#buyinU10').text().slice(1);
    targetWks = $('#wksU10').text().slice(0,3);;
    targetSes = $('#sesU10').text().slice(0,2);
    targetMin = $('#minU10').text().slice(0,3);
    targetStart = $('#startU10').text();
    targetStartStamp =$('#startU10');
    populateTargetModal();
  });

function populateTargetModal(){
  updateEthPrice();
  $("#soonEcho").html(
    "You're commiting $" + targetStake + " to working out for " + 
    targetMin +"minutes, "+ targetSes+" times per week, for "+ 
    targetWks+  " weeks, starting automatically on "+ targetStart+". The challenge ID is "+ targetGoalID.slice(0, 8)
  );
}

function joinTarget(){
  console.log("goalID is: "+targetGoalID+", stravaID is: "+stravaID+", ethprice is: "+ethPrice);
  Nceno.methods.join(
    targetGoalID,
    stravaID,
    ethPrice*100, //ethprice in pennies, gets rid of decimals
    web3.utils.toHex($('#promoFieldSoon').val())
  )
  .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 3500000, gasPrice: Math.ceil(gasPriceChoice)*1000000000, value: 1000100000000000000*targetStake/ethPrice},
    function(error, result) {
      if (!error){
        $("#joinSoonModalBtn").hide();
        $("#joinSoonLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){
    console.log(receipt.status);
    if(receipt.status === true){
        correctNonce++;
        $('#joinSoonLoader').hide();
        $("#soonEcho").html('');
        $('#joinSoonSuccess').html('<p>You’re in the challenge: '+targetGoalID+' ! Don’t forget to invite your friends and mark the starting time in your calendar!</p>');
        $('#joinSoonModalBtn').hide();
        $('#promoFieldSoon').hide();
        $('#joinSoonReminder').show();
        //targetStart is a text date... need the timestamp.
        reminder('joinSoonReminder', targetStake, targetMin, targetSes, targetWks, targetGoalID, targetStartStamp);
        stravaShare(targetStartStamp, targetMin, targetStake, targetSes, targetWks, targetGoalID);
      }
      else{
        $("#soonEcho").html('');
        $("#joinSoonLoader").hide();
        $("#soonJoinTitle").hide();
        $("#joinSoonModalBtn").hide();
        $('#promoFieldSoon').hide();
        $("#joinSoonFail").html('<p>Cannot join. Either this challenge already started, or else you are already in this challenge. Go check your upcoming goals! (ID: '+targetGoalID.slice(0, 8)+')</p>');
        console.log("UI: Challenge already started, user already is a participant, or else message value is less than intended stake.");
      } 
    }
  ).once('error', function(error){console.log(error);});
}

var browsedGoal;

//button to claim lost stake from previous week. needs work.
$("#claimBtn").click(function() {
  var goalid = web3.utils.padRight($("#goalCategories").val(),34);
  //function:
  Nceno.methods.claim(
    goalid,
    stravaID
  )
  .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 2500000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){
        $("#claimBtn").hide();
        $("#claimLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt, result){
    console.log(receipt.status);
    if(receipt.status === true){
      correctNonce++;
      //----------event listener
      var usdCut;
      Nceno.events.Claim({
        filter: {_goalID: goalid, _stravaID: stravaID},
        fromBlock: 0, toBlock: 'latest'
      }, (error, event) => { 
          console.log(event);
          usdCut = parseInt(event.returnValues._cut)/1000000000000000000;
          console.log("cut was: $"+usdCut.toFixed(2));
          //----begin other messages

          
          if(usdCut>0){
            $("#claimLoader").hide();
            $("#claimTitle").hide();
            $("#claimSuccess").html('<p>Nice job, you were 100% successful last week! You just won $'+usdCut+' from the people who skipped workouts.</p>');
          }
          else{
            $("#acctLoader").hide();
            $('#claimFail').html('<p>Your cut is $0.00 because everyone completed all of their workouts... Is this challenge too easy?</p>');
          }
          //----end other messages
      })
      .on('error', console.error);
      //--------/end event listener
      correctNonce++;
      console.log("your cut is: "+result);

      
    }
    else{
      $("#acctLoader").hide();
      $('#claimFail').html('<p>Transaction failed. Did you already claim this week?</p>');
      console.log("wallet-user mismatch, user not a competitor, user not 100% adherent for the week, or user already claimed bonus for the week.");
    }   
  })
    .once('error', function(error){console.log(error);});;
});

//not sure if using window.onload correctly... but,
//this initializes a bunch of stuff as soon as the user navigates to the app page.

window.onload = function() {

  portis.onLogin((walletAddress, email) => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      console.log("default: " + web3.eth.defaultAccount);
      portisEmail = email;
      console.log("portis email is: "+ portisEmail);
      localize();
      getToken();
      $("#portisBtn").hide();
      $("#portisSuccess").html("Wallet address: "+web3.eth.defaultAccount.slice(0, 22)+" "+web3.eth.defaultAccount.slice(23, 42));
    });
  });



  //sliders
  $("#sliderMins").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 20,
    max: 120,
    step: 5,
    value: 45,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal1",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderSes").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 2,
    max: 7,
    step: 1,
    value: 3,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal2",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderWks").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 2,
    max: 12,
    step: 2,
    value: 6,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal3",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderStake").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 10,
    max: 300,
    step: 5,
    value: 55,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal4",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });

  //delays extraction of the fitbit creds until the user has authed.
  if (window.location.href != 'https://www.nceno.app/app.html'){
    $("#stravaBtn").hide();
    $("#stravaOk").html("Proceed to step 2...")
    $("#stravaOk").show();
  }
};

//chart tool tips
function tooltipVal1(args) {
    return args.value + " mins";
}
function tooltipVal2(args) {
    return args.value + "x per week";
}
function tooltipVal3(args) {
    return "for "+args.value + " weeks";
}
function tooltipVal4(args) {
    return "$"+args.value + " at stake";
}

//global variables that will sync logged minutes to UTC time from the local time.
//var pad;
//var sign;
var flag;
function localize(){
  $.getJSON("https://api.ipdata.co/?api-key=25948172f6d73640c781a87df67ef61f03bf5948cbc333f56fd0baf6", function(data) {
    var countryName = data.country_name;
    //var timezone = data.time_zone.offset;
    flag = data.country_code;
    //console.log("Country Name: " + countryName);
    //console.log("Time Zone: " + timezone);
    //sign = parseInt(timezone.slice(0, 1)+1);
    //pad = parseInt(timezone.slice(1, 3)*60*60 + timezone.slice(3, 5)*60)
    //pad = parseInt(timezone.slice(0, 1)+1)
    //console.log(pad);
    console.log("Flag URL: " + flag);
    getMobileOS();
  });
}

var safeLow;
var standard;
var fast;
var fastest;
var gasPriceChoice
function updateGasPrice(){
  $.getJSON("https://www.etherchain.org/api/gasPriceOracle", function(data) {
    safeLow = data.safeLow;
    standard = data.standard;
    fast = data.fast;
    fastest = data.fastest;
    //admin can control the gas price
    gasPriceChoice = standard+1;
    console.log(standard+" < gasPrice < "+fast);    
  });
}


//gets the current price of ETH in USD. Should be called as close as possible to goal deployment.
function updateEthPrice(btn) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var resp = JSON.parse(xhr.responseText);
      ethPrice = resp.USD;
      console.log(this.responseText);
      console.log(ethPrice);
      $('#'+btn).show();

    }
  });
  xhr.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
  xhr.send();
}


//gets the access token to make GET request. Valid for 6 hours.
var access_token;
var stravaID;
var stravaUsername;
var userCreated;
var uniqueUserString;
var e4668610b5d6bee15fcd68d0cb88a1f65ae1ad3 = 'e4668610b5d6bee15fcd68d0cb88a1f656ae1ad3';
var code = window.location.href.split('#')[1].split('=')[2].split('&')[0];
//var tokenExpire = 0;

function getToken(){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      access_token = data.access_token;
      //tokenExpire = data.expires_in;
      stravaID = data.athlete.id;
      console.log("strava id is:"+stravaID);
      
      //if(data.athlete.username == undefined){
        stravaUsername = portisEmail.substring(0, portisEmail.lastIndexOf("@"));
      //}
      //else {stravaUsername = data.athlete.username;}
      

      $("#stravaOk").hide();
      $("#stravaSuccess").html('<h5><a style="color:white;">Welcome, </a></h5>'+stravaUsername);
      userCreated = Date.parse(data.athlete.created_at);
      uniqueUserString = stravaID.toString() + userCreated.toString();
      userID1 = uniqueUserString;
      //console.log(uniqueUserString);
      
      Nceno.methods.userExists(stravaID
      )
      .call({from: web3.eth.defaultAccount},
        function(error, result) {
          if (!error){
            if(!result){
              $("#makeAcctBtn").show();          
            }
          }
          else
          console.error(error);
        }
      );

    }
  });
  xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=33084&client_secret='+e4668610b5d6bee15fcd68d0cb88a1f65ae1ad3+'&code='+code+'&grant_type=authorization_code');
  //xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(stuff);
}

//gets activity minutes from strava
//var stravaMins;
//var avgHR;
var placeholderDate = new Date();
placeholderDate.setDate(placeholderDate.getDate() - 1); //can change "1" day to "20" days for testing.
var yesterday =parseInt(parseInt(placeholderDate.getTime())/1000);
var nowDate = parseInt(parseInt(new Date().getTime())/1000);

function getActivities(){
  $('#payMeBtn').hide();
  $('#logLoader').show();
  var goalMovingTime;
  Nceno.methods.getGoalParams(goalid)
  .call({from: web3.eth.defaultAccount},
      function(error, result) {
      if (!error){
        goalMovingTime = result[0];
      }
      else
      console.error(error);
  });

  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      //clean the data and make a list of valid workouts.
      var cleaned = new Array();

      let i=0;
      let k=0;
      while(i<data.length){
        if(data[i].manual == false && data[i].has_heartrate == true && data[i].average_heartrate>99 && data[i].elapsed_time/60>=goalMovingTime){
          cleaned[k] = [data[i].id, data[i].average_heartrate, data[i].elapsed_time/60];
          //cleaned.push([data[i].id, data[i].average_heartrate, data[i].moving_time/60]);
          //console.log("added: ["+cleaned[i]+"]");
          k++;
        }
        i++;
      }

      console.log("cleaned length is: "+cleaned.length);
      console.log(cleaned);
      //if there is at least one valid workout, log it in the contract, triggering payout.
      if(cleaned.length>0){
        
        console.log("Good news, your workout is being logged for a payout!");
        console.log(goalid+","+stravaID+","+ cleaned[0][0]+","+Math.round(cleaned[0][1])+","+Math.round(cleaned[0][2]));
        

        //log the data to get a payout
        Nceno.methods.log(
          goalid,
          //$('#goalCategories').val();
          stravaID,
          cleaned[0][0],
          Math.round(cleaned[0][1]),
          Math.round(cleaned[0][2])
        )
        .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 6500000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
          function(error, result) {
            if (!error){
              /*$("#joinSearch").hide();
              $("#srCancelBtn").hide();
              $("#joinLoader").show();*/
              console.log(result);
            }
            else
            console.error(error);
          }
        ).once('confirmation', function(confNumber, receipt, result){
          console.log(receipt.status);
          if(receipt.status === true){
            
            //----------event listener
            var usdPayout;
            Nceno.events.Log({
              filter: {_goalID: goalid, _stravaID: stravaID},
              fromBlock: 0, toBlock: 'latest'
            }, (error, event) => { 
                console.log(event);
                usdPayout = parseInt(event.returnValues._payout)/1000000000000000000;
                console.log("payout was: $"+usdPayout.toFixed(2));
                //----begin other messages

                $('#logEcho').html('<p>Your workout: Avg heart rate was '+Math.round(cleaned[0][1])+ 'bpm, Session length was '+Math.round(cleaned[0][2])+'mins.</p>');
                
                if(usdPayout>0){
                  $('#logSuccess').html('<p style="color:white;">Great job, you just earned back $'+usdPayout.toFixed(2)+' of your stake! Check your wallet.</p>');
                  $('#logSuccess').show();
                }
                else{
                  $('#logLoader').hide();
                  $('#getYouPaid').hide();
                  $('#logFail').html('<p>Good job, but no payout for this one... You already logged a workout today.</p>');
                }
                //----end other messages
            })
            .on('error', console.error);
            //--------/end event listener

            $('#logLoader').hide();
            $('#getYouPaid').hide();
            correctNonce++;
            
          }
          else{
            $('#logLoader').hide();
            $('#getYouPaid').hide();
            $('#logFail').html('<p>"wallet-user mismatch, user is not competitor, goal has not started yet, or goal has already finished.</p>');
            console.log("wallet-user mismatch, user is not competitor, goal has not started yet, or goal has already finished.");
          } 
        })
        .once('error', function(error){console.log(error);});;
      }
      else{
        console.log("No valid workouts today..."+cleaned.length);
        //if no valid workouts, don't log, and alert the user.
        $('#getYouPaid').hide();
        $('#logLoader').hide();
        //$('#logFail').show();
        $('#logFail').html('<p>You don’t have any valid workouts today. </p>');

      } 
    }
  });

  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}