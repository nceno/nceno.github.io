//datepicker initializer
var first = new Date();
first.setDate(first.getDate() + 1);
//$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
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
      //console.log("this ETH address: " + web3.eth.defaultAccount);
      portisEmail = email;
      //console.log("this portis email is: "+ portisEmail);
      //localize();
      getToken();
      $("#portisBtn").hide();
      updateGasPrice();

      //$("#portisSuccess").html('<a style="color:white;">Wallet address: </a>'+web3.eth.defaultAccount.slice(0, 22)+' '+web3.eth.defaultAccount.slice(23, 42));
      $("#portisSuccess").html('<h5><a style="color:#ffffff;">Connection: </a></h5><a style="color:#ccff00;">successful!</a>');
      $("#openWallet").show();
      
    });
  });
}

//sanity check for debugging
console.log(NcenoBrands);

//hides all the loaders
$("#createBtn").hide();
$("#acctLoader").hide();
$("#acctSuccess").hide();
$("#createLoader").hide();
$("#createSuccess").hide();
//$("#dashboard").hide();
$("#logLoader").hide();
$("#logSuccess").hide();
$("#claimLoader").hide();
$("stravaSuccess").hide();
$("stravaOk").hide();
$("portisSuccess").hide();
$("#request").hide();
$("#joinChallengeLoader").hide();
//$("#joinSuccess").hide();
$("#joinSoonLoader").hide();
//$("#joinSoonSuccess").hide();
$("#makeAcctBtn").hide();
$("#openWallet").hide();
$("#portisLoader").hide();

$("#joinSearch").hide();
$('#joinSoonModalBtn').hide();
$("#claimBtn").show();

/*for(let h=1; h<13; h++){
  $('#btnU'+h).hide();
  
  $('#w'+h+'log').hide();
  $('#w'+h+'claim').hide();
  
  $('#week'+h).hide();
}*/

//timestamps are in this format: yyyymmddT160000Z
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
function reminder(_target, _stake, _minutes, _frequency, _duration, _goalid, _start){
  //need to convert these times

  var s = new Date(_start*1000).toISOString();
  //.000, -, :
  var start = s.replace(/:/g, "").replace(/-/g, "").replace(".000", "");
  var e = new Date(1000*(_start+_duration*604800)).toISOString();
  var end = e.replace(/:/g, "").replace(/-/g, "").replace(".000", "");
  $('#'+_target).html('<a style="color:#ccff00;" target= "_blank" href ="https://www.google.com/calendar/r/eventedit?text=My%20Nceno%20goal&location=www.NcenoBrands.app/app.html&details=You%20committed%20$' + _stake + '%20to%20working%20out%20for%20' + _minutes + 'min,%20'+ _frequency+ 'x%20per%20week,%20for%20'+ _duration + '%20weeks.%20The%20challenge%20ID%20is%20'+_goalid+'.&dates='+start+'/'+end+'">Add to Google Calendar</a>');
}

//shares the challenge to strava automatically
function stravaShare(_start, _minutes, _stake, _frequency, _weeks, _goalid){
  var challengeStart = new Date(_start*1000).toDateString();
  var startDateLocal = new Date().toISOString(); //need to convert from UTC to local timezone.... will not affect the challenge.

  var nameString = '$'+_stake+'... Anyone wanna join me?';
  var descriptionString = 'I’m hosting a challenge worth $'+_stake+ ' to workout for '+_minutes+'mins, '+_frequency+'x per week, for '+_weeks+' weeks. If you wanna join me, go to www.NcenoBrands.app/app and search for challenge ID "'+_goalid.slice(0, 8)+'". It starts on '+ challengeStart+'.';

  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
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

//brands join
$("#joinChallenge").click(function() {
  NcenoBrands.methods.join(
    goalID, 
    stravaID, 
    _userName, 
    _inviteCode)
  .send({from: web3.eth.defaultAccount, gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){

        $("#joinChallenge").hide();
        $("#joinChallengeLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){ 
    console.log(receipt.status);
    if(receipt.status === true){
      updateNonce();
      $("#joinChallengeLoader").hide();
      $("joinChallenge").hide();
    }
    else{
      $("#joinChallengeLoader").hide();
      $("#joinChallenge").hide();
      $('#joinChallengeFail').html('<p>Sorry, invite code invalid or challenge has stopped.</p>');
      console.log("profile already exists!");
    } 
  }).once('error', function(error){console.log(error);});
});


//randomizes the goalID
/*function randGoalID(){
  goalID = web3.utils.padRight(web3.utils.randomHex(3),6);
}*/

//creating a goal from the slider values and live ethereum price
//var goalID = web3.utils.padRight(web3.utils.randomHex(3),6);
$("#hostBtn").click(function() {

  var KmReward = $("#sliderReward").roundSlider('getValue',1).toString();
  var BpmReward = $("#sliderReward").roundSlider('getValue',2)-$("#sliderReward").roundSlider('getValue',1).toString();
  var target = $("#sliderTarget").roundSlider("getValue");
  var kmTarget = Math.round(target/($("#sliderReward").roundSlider('getValue',1)*(1+0.1*$("#sliderReward").roundSlider('getValue',2))));
  var minsTarget = 10*kmTarget;
  var start = new Date($("#dateChoice").datepicker('getDate')).getTime() / 1000;
  var daysDur = $("#sliderDays").roundSlider("getValue").toString();
  var pot = $("#sliderPot").roundSlider("getValue").toString();

  NcenoBrands.methods.host(
    goalID,
    start,  
    daysDur,
    kmTarget.toString(), 
    minsTarget.toString(),  
    pot, 
    KmReward, 
    BpmReward, 
    tokenAddress
  )
  .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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
      //deposit tokens here...
      AleToken.methods.transfer(
        contractAddress,
        pot
      )
      .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
        function(error, result) {
          if (!error){
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
          $("#hostBtn").hide();
        }
      })      
    }
    else{
      $("#createLoader").hide();
      $("#hostBtn").hide();
      $('#createFail').html('<p>Transaction failed. User account does not exist, or else message value is less than intended stake.</p>');
      console.log("User does not exist, or else message value is less than intended stake.");
    }
    }
    )
    .once('error', function(error){console.log(error);});;
});

//function that displays in a modal, a summary of the goal you are setting.
function echoGoal(){

  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  //echo modal
  $("#host").tab('show');
  $('#popupCreate').modal('show');

  $("#goalEcho").html(
    "You're offering a maximum of " + $("#sliderPot").roundSlider("getValue") + " tokens to your employees to work out for " + 
    $("#sliderDays").roundSlider("getValue")+  " days, at a reward rate of "+$("#sliderReward").roundSlider('getValue',1)+" tokens/km with no heart rate data, and "+
    $("#sliderReward").roundSlider('getValue',2)+" tokens/10min for exercises with heart rate, starting automatically from "+ $("#dateChoice").datepicker('getDate', true) +"."
  );
  console.log($("#sliderReward").roundSlider('getValue',1));
}

function resetCreate(){
  $("#hostBtn").show();
  $("#cancelBtn").show();
  $("#createSuccess").hide();
  $("#createLoader").hide();
  $("#createReminder").html('');
  $("#createFail").html('');
  //randGoalID();
  $("#chalID").html('');
  $('#promoField').show();
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
  $('#promoFieldSearch').show();
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
  $("#joinSoonReminder").hide();
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
var goalid;

function selectedChallenge(){
  // Initialize Selectric and bind to 'change' event
  $('#goalCategories').selectric().on('change', function() {
    goalid = web3.utils.padRight($('#goalCategories').val(),34);
    console.log("selected goal is: "+goalid);
    $("#selID").html(goalid.slice(0,8));

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

    NcenoBrands.methods.getGoalParams(goalid)
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
          makeWktl();
       
          await NcenoBrands.methods.getParticipants(goalid)
          .call({from: web3.eth.defaultAccount},
            async function(error, result) {
              if (!error){
                
                var ids = new Array();
                var names = new Array();
                var flags = new Array();
                
                ids = result[0];
                names = result[1];
                flags = result[2];
                var competitorCount = result[3];


      //////////////// warning: do you mean to call a for loop on the nested function as well?
                for (let k = 0; k < compcount; k++){

                  await NcenoBrands.methods.getMyGoalStats1(ids[k], goalid)
                  .call({from: web3.eth.defaultAccount},
                    async function(error, result) {
                      if (!error){
                        
                        var adherence = new Array();
                        adherence[k] = result[0];

                        await NcenoBrands.methods.getMyGoalStats2(ids[k], goalid)
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
                                await NcenoBrands.methods.getGoalArrays(goalid, stravaID)
                                .call({from: web3.eth.defaultAccount},
                                  function(error, result) {
                                    if (!error){
                                      lockedPercentWk = result[0];

                                      var claimStatusWk = new Array();
                                      claimStatusWk = result[4];
                                      
                                      //hide the current locked stake percent from the user
                                      if(currentWeek>1){
                                        visibleLockedPercentWk = lockedPercentWk.slice(0, currentWeek-1);
                                      }
                                      else(visibleLockedPercentWk=[0])

                                      successesWk = result[1];
                                      winnersWk = result[2];

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
      //this might error when user's stravaID is lower in the list than where the loop is at
      //because bonusKey is updated before this function.
      //need to test...
      /////////////////////////////////
                                        $('#'+bonusKey).html("$" +(wkBonus[stravaID][k]/100).toFixed(2));
                                        $('#'+unKey).html("$" +(wkPayout[stravaID][k]/100).toFixed(2));
      /////////////////////////////////

                                        //$('#'+finKey).html(winnersWk[k] +" of "+ competitors);
                                        $('#'+finKey).html("$" +lost.toFixed(2));


                                        //disallow logging and claiming if quotas are met
                                        //if(k>0 && successesWk[k-1] != sessions){
                                        //final bug...
                                        if(k>0 && successesWk[k-1] != sessions || claimStatusWk[currentWeek-2] > 0 || competitorCount === 1){
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
                                          //fixed the smart contract, but this will persist until we redeploy it. then will need to fix this.
                                          sum += Math.round(0.1*(wkPayout[stravaID][k]+wkBonus[stravaID][k])/(1000000000000000000*USDstake));
                                        }
                                        roi[i] = sum;
                                      }

                                      //% Competitors finished the week
                                      var finishers = new Array();
                                      for(let i = 0; i<wks; i++){
                                        finishers[i] = winnersWk[i]*100/competitors;
                                      }

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

  $("#request").show();
  var goalid = web3.utils.padRight($('#searchField').val(),34)

  NcenoBrands.methods.getGoalParams(goalid)
  .call({from: web3.eth.defaultAccount},
      function(error, result) {
      if (!error){
        //echo challenge

        var tstamp = new Date(result[4]*1000);
        //var buyin = Math.round(result[1]*result[5]/100000000000000000000);
        stakeweiSearched = 1000000000000000000*result[1]/ethPrice;
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
var targetStartStamp;

async function browse(){
  updateNonce();
  //clear out the goalIDs from old elements
  for(let p=1; p<11; p++){
    $('#idNumberU'+p).val('');
  }

  
  for (let i = 0; i < 10; i++){
    var result = await NcenoBrands.methods.getFutureGoal(i).call({from: web3.eth.defaultAccount});


    if(result[0] != 0x0000000000000000000000000000000000000000000000000000000000000000 && result[0] != undefined){
      //list it in the table
      var tstamp = new Date(result[5]*1000);
      //console.log('tstamp is: '+tstamp.getTime()/1000);
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
      var tKey = 'tstampU'+n;
      var stupid = parseInt(tstamp.getTime()/1000);
      console.log(stupid);

      $('#'+tKey).hide();
      $('#'+tKey).html(stupid+'');
      
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
    targetStartStamp = parseInt($('#tstampU1').text());
    populateTargetModal();
  });
  $('#soonJoin2').click(function(){
    targetGoalID = $('#idNumberU2').text();
    targetStake = $('#buyinU2').text().slice(1);
    targetWks = $('#wksU2').text().slice(0,3);;
    targetSes = $('#sesU2').text().slice(0,2);
    targetMin = $('#minU2').text().slice(0,3);
    targetStart = $('#startU2').text();
    targetStartStamp = parseInt($('#tstampU2').text());
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
    targetStartStamp = parseInt($('#tstampU3').text());
    populateTargetModal();
  });
  $('#soonJoin4').click(function(){
    targetGoalID = $('#idNumberU4').text();
    targetStake = $('#buyinU4').text().slice(1);
    targetWks = $('#wksU4').text().slice(0,3);;
    targetSes = $('#sesU4').text().slice(0,2);
    targetMin = $('#minU4').text().slice(0,3);
    targetStart = $('#startU4').text();
    targetStartStamp = parseInt($('#tstampU4').text());
    populateTargetModal();
  });
  $('#soonJoin5').click(function(){
    targetGoalID = $('#idNumberU5').text();
    targetStake = $('#buyinU5').text().slice(1);
    targetWks = $('#wksU5').text().slice(0,3);;
    targetSes = $('#sesU5').text().slice(0,2);
    targetMin = $('#minU5').text().slice(0,3);
    targetStart = $('#startU5').text();
    targetStartStamp = parseInt($('#tstampU5').text());
    populateTargetModal();
  });
  $('#soonJoin6').click(function(){
    targetGoalID = $('#idNumberU6').text();
    targetStake = $('#buyinU6').text().slice(1);
    targetWks = $('#wksU6').text().slice(0,3);;
    targetSes = $('#sesU6').text().slice(0,2);
    targetMin = $('#minU6').text().slice(0,3);
    targetStart = $('#startU6').text();
    targetStartStamp = parseInt($('#tstampU6').text());
    populateTargetModal();
  });
  $('#soonJoin7').click(function(){
    targetGoalID = $('#idNumberU7').text();
    targetStake = $('#buyinU7').text().slice(1);
    targetWks = $('#wksU7').text().slice(0,3);;
    targetSes = $('#sesU7').text().slice(0,2);
    targetMin = $('#minU7').text().slice(0,3);
    targetStart = $('#startU7').text();
    targetStartStamp = parseInt($('#tstampU7').text());
    populateTargetModal();
  });
  $('#soonJoin8').click(function(){
    targetGoalID = $('#idNumberU8').text();
    targetStake = $('#buyinU8').text().slice(1);
    targetWks = $('#wksU8').text().slice(0,3);;
    targetSes = $('#sesU8').text().slice(0,2);
    targetMin = $('#minU8').text().slice(0,3);
    targetStart = $('#startU8').text();
    targetStartStamp = parseInt($('#tstampU8').text());
    populateTargetModal();
  });
  $('#soonJoin9').click(function(){
    targetGoalID = $('#idNumberU9').text();
    targetStake = $('#buyinU9').text().slice(1);
    targetWks = $('#wksU9').text().slice(0,3);;
    targetSes = $('#sesU9').text().slice(0,2);
    targetMin = $('#minU9').text().slice(0,3);
    targetStart = $('#startU9').text();
    targetStartStamp = parseInt($('#tstampU9').text());
    populateTargetModal();
  });
  $('#soonJoin10').click(function(){
    targetGoalID = $('#idNumberU10').text();
    targetStake = $('#buyinU10').text().slice(1);
    targetWks = $('#wksU10').text().slice(0,3);;
    targetSes = $('#sesU10').text().slice(0,2);
    targetMin = $('#minU10').text().slice(0,3);
    targetStart = $('#startU10').text();
    targetStartStamp = parseInt($('#tstampU10').text());
    populateTargetModal();
  });

function populateTargetModal(){

  $("#soonEcho").html(
    "You're commiting $" + targetStake + " to working out for " + 
    targetMin +"minutes, "+ targetSes+" times per week, for "+ 
    targetWks+  " weeks, starting automatically on "+ targetStart+". The challenge ID is "+ targetGoalID.slice(0, 8)
  );
}

function joinTarget(){
  console.log("goalID is: "+targetGoalID+", stravaID is: "+stravaID+", ethprice is: "+ethPrice);
  console.log("targetStartStamp is: "+targetStartStamp);
  NcenoBrands.methods.join(
    targetGoalID,
    stravaID
    //web3.utils.toHex($('#promoFieldSoon').val())
  )
  .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){
        $("#joinSoonModalBtn").hide();
        $("#joinSoonLoader").show();
        $('#promoFieldSoon').hide();
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
        $('#joinSoonSuccess').html('<p>Success! You’re in the challenge: '+targetGoalID.slice(0, 8)+' . Don’t forget to invite your friends and mark the starting time in your calendar!</p>');
        $('#joinSoonModalBtn').hide();
        $('#promoFieldSoon').hide();
        $("#joinSoonReminder").show();
        //targetStart is a text date... need the timestamp.
        reminder('joinSoonReminder', targetStake, targetMin, targetSes, targetWks, targetGoalID, targetStartStamp);
        stravaShare(targetStartStamp, targetMin, targetStake, targetSes, targetWks, targetGoalID);
        createUser();
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
//this initializes a bunch of stuff as soon as the user navigates to the app page.
window.onload = function() {

  //sliders
  $("#sliderTarget").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 10,
    max: 100,
    step: 5,
    value: 30,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal1",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderPot").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 100,
    max: 2000,
    step: 10,
    value: 700,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal2",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderDays").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 7,
    max: 60,
    step: 1,
    value: 30,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal3",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderReward").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 1,
    max: 10,
    step: 1,
    value: "2,4",
    sliderType: "range",
/*    tooltipFormat: "tooltipVal4",*/
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  
/*  $("#sliderHRbonus").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 0,
    max: 10,
    step: 1,
    value: 2,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal5",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });*/

  //@NCENO setup
  //delays extraction of the fitbit creds until the user has authed.
  if (window.location.href != 'https://www.nceno.app/app_brands.html' 
    && window.location.href != 'https://www.nceno.app/app_brands'
    && window.location.href != 'https://nceno.app/app_brands'
    && window.location.href != 'https://nceno.app/app_brands.html'){
    $("#stravaBtn").hide();
    $("#stravaOk").html("Proceed to step 2")
    $("#stravaOk").show();
  }
};

//chart tool tips
function tooltipVal1(args) {
    return args.value + " token cap";
}
function tooltipVal2(args) {
    return args.value + " token pot";
}
function tooltipVal3(args) {
    return args.value + " days";
}
/*function tooltipVal4(args) {
    return args.value + " reward";
}*/


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
    //default to fast gas  
    gasPriceChoice = parseInt(fastest)+1.0; 
    console.log(safeLow+" < "+standard+" < gas < "+fast+" < "+fastest);
    console.log("gasPrice set at: "+gasPriceChoice);

  });
}

//gets the access token to make GET request. Valid for 6 hours.
var access_token;
var stravaID;
var stravaUsername;
var userCreated;
var uniqueUserString;
/*var code = window.location.href.split('#')[1].split('=')[2].split('&')[0];*/
var code = window.location.href.split('=')[2].split('&')[0];
Cookies.set('code', code);
//var tokenExpire = 0;


function getToken(){
  console.log("code is: "+code);
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      access_token = data.access_token;
      Cookies.set('access_token', access_token);
      //tokenExpire = data.expires_in;
      stravaID = data.athlete.id;
      Cookies.set('stravaID', stravaID);
      //console.log("strava id is:"+stravaID);
      
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

      console.log("Nceno User ID: "+stravaID+"   Nceno Email: "+portisEmail+"   Wallet address: "+web3.eth.defaultAccount);
      $("#athleteInfo").html('<p>Nceno User ID: "'+stravaID+'"   <br>Nceno Email: "'+portisEmail+'"   <br>Wallet address: "'+web3.eth.defaultAccount.slice(0, 22)+' '+web3.eth.defaultAccount.slice(23, 42)+'"</p>');
    }
  });
  //allofnceno ONEOFUS!
  xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=41825&client_secret=790acb08d1be8c0e1930a5fdcaee01d6139e04c8&code='+code+'&grant_type=authorization_code');
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
  var goalMovingTime = 19;

  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function(){
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      //clean the data and make a list of valid workouts.
      var cleaned = new Array();

      let i=0;
      let k=0;
      console.log("data[0]= "+data[0]);
      while(i<data.length){
        if(data[i].manual == false && data[i].moving_time/60>=goalMovingTime){
          cleaned[k] = [data[i].id, data[i].moving_time/60];
          //cleaned.push([data[i].id, data[i].average_heartrate, data[i].moving_time/60]);
          //console.log("added: ["+cleaned[i]+"]");
          k++;
        }
        i++;
      }

      //sorting algo
      /* var arrayMaxIndex = function(array) {
        return array.indexOf(Math.max.apply(null, array));
      };
      console.log(arrayMaxIndex([1,2,7,2])); //outputs 2*/

      console.log("cleaned length is: "+cleaned.length);
      console.log(cleaned);
      //if there is at least one valid workout, log it in the contract, triggering payout.
      if(cleaned.length>0){
        
        console.log("Good news, your workout is being logged for a payout!");
        console.log(goalid+","+stravaID+","+ cleaned[0][0]+","+Math.round(cleaned[0][1])+","+Math.round(cleaned[0][2]));
        

        //log the data to get a payout
        NcenoBrands.methods.log(
          goalid,
          //$('#goalCategories').val();
          stravaID,
          cleaned[0][0],
          Math.round(cleaned[0][1]),
          Math.round(cleaned[0][2])
        )
        .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 300000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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
          //start here left off pick up here
        ).once('confirmation', function(confNumber, receipt, result){
          console.log(receipt.status);
          console.log(receipt);
          if(receipt.status === true){
            $('#logLoader').hide();
            console.log("payout is: "+receipt.events.Log.returnValues['_payout']);
            
            //----------event listener
            var usdPayout = receipt.events.Log.returnValues['_payout']/1000000000000000000;
            var loggedHR = receipt.events.Log.returnValues['_avgHR']
            var loggedMins = receipt.events.Log.returnValues['_reportedMins']
            //-----/


                $('#logEcho').html('<p>Your workout: Avg heart rate was '+loggedHR+ 'bpm, Session length was '+loggedMins+'mins.</p>');
                
                if(usdPayout>0){
                  //$('#logSuccess').html('<p style="color:white;">Great job, you just earned back some of your stake! Check your wallet in a bit.</p>');
                  $('#logSuccess').html('<p style="color:white;">Great job, you just earned back $'+usdPayout.toFixed(2)+' of your stake! Check your wallet.</p>');
                  $('#logSuccess').show();
                  makeWktl();
                }
                else{
                  $('#logLoader').hide();
                  $('#getYouPaid').hide();
                  $('#logFail').html('<p>Good job, but no payout for this one... You already logged this workout today.</p>');
                }
                //----end other messages
            //})
            //.on('error', console.error);
            //--------/end event listener

            $('#logLoader').hide();
            $('#getYouPaid').hide();
            correctNonce++;
            
          }
          else{
            $('#logLoader').hide();
            $('#getYouPaid').hide();
            $('#logFail').html('<p>"wallet mismatch, user is not competitor, goal has not started , or goal has finished.</p>');
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