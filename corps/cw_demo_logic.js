console.log("454");
//const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'rinkeby', { gasRelay: true, scope: ['email'] });
//const web3 = new Web3(portis.provider);

$("#dispHR").html("-"); 
$("#dispMins").html("-");
$("#dispTime").html("-"); 
$("#dispSpeed").html("-");
$("#dispDist").html("-"); 
$("#dispValue").html("-");

function signOut(){
  Cookies.remove('access_token');
  Cookies.remove('stravaID');
  Cookies.remove('stravaUsername');
  Cookies.remove('userWallet');
  location.reload();
}

function makeWorkoutPage(){
  //---get goal params

  /*$('#me').empty();
  for(var j=0; j<10; j++){
    $('#entry'+j).remove();
  }*/

  NcenoBrands.methods.getGoalParams(_goalID)
  .call({from: Cookies.get('userWallet')},
    async function(error, resultA) {
      if (!error){
        var start = parseInt(resultA[0]);
        var dur = parseInt(resultA[1]);
        var tokenCap = parseInt(resultA[2]);
        var compcount = parseInt(resultA[3]);
        var remainingTokens = parseInt(resultA[4]);
        var bpmReward = parseInt(resultA[5]); //per 10mins
        var kmReward = parseInt(resultA[6]); //per km

        $('#me').empty();
        for(var j=0; j<compcount; j++){
          $('#entry'+j).remove();
        }

        //---get other players
        for(var i= 0; i<compcount; i++){
          console.log("----------------------- next iteration----------");
          console.log("i= "+i);
          await NcenoBrands.methods.getIndexedPlayerID(_goalID, i)
          .call({from: Cookies.get('userWallet')},
            function(error, resultB) {
              if (!error){
                console.log("i= "+i);

                var playerID =  resultB[0]; 
                var playerName = resultB[1];
                //---call that player
                NcenoBrands.methods.getPlayer(_goalID, playerID)
                .call({from: Cookies.get('userWallet')},
                  async function(error, resultC) {
                    if (!error){
                      //console.log(result);
                      
                      var theirKms = resultC[0]; 
                      var theirMins = resultC[1]; 
                      var theirReward = resultC[2];
                      var theirProgress = Math.round(100*theirReward/tokenCap);
                      var avatar = resultC[4];

                      
                      switch(avatar){
                        case "0":
                          avatar = "runner0";
                          break;

                        case "1":
                          avatar = "runner1";
                          break;
                          
                        case "2":
                          avatar = "runner2";
                          break;
                          
                        case "3":
                          avatar = "runner3";
                          break;
                        
                        case "4":
                          avatar = "runner4";
                          break;
                        
                        case "5":
                          avatar = "runner5";
                          break; 
                      }

                      if(playerID == Cookies.get('stravaID')){
                        //post to top if it's me
                        console.log("I am "+playerName+". player "+i);
                        //if(! $('#me').length){
                          $("#me").prepend(
                            '<h4 class="progress-title">'  +playerName+ '<font style="color:#ccff00;"> +' +theirReward+' '+TOKENSYMBOL+ '</font> / <font style="color:#f442b3;">' +theirKms+ 'km + '+theirMins+'mins</font></h4><div class="progress-item"><div class="progress"><div class="progress-bar bg-blue" role="progressbar" style="width:' +theirProgress+ '%;" aria-valuenow="' +theirProgress+ '" aria-valuemin="0" aria-valuemax="100"><span><img height="40" width="40" src="../app/assets/images/'+avatar+'.png"> </span></div></div>'
                          );
                        //}
                        //populate my quick stats .........
                        $("#progressPerc").html(theirProgress+'%');
                        $("#user").html(playerName);                
                        var days = Math.round((start+dur*86400-Date.now()/1000)/86400);
                        $("#daysLeft").html(days+" days");
                        $("#rewardSlot").html(theirReward+' '+TOKENSYMBOL);
                        $("#potRem").html(remainingTokens+' '+TOKENSYMBOL);
                        $("#leaderboardCount").html(compcount);

                      }
                      //only after if there isn't already an element of the same name
                      else if(! $('#entry'+i).length){
                        //.after following entries
                        console.log(playerName+" is player "+i);
                        //$('#entry'+ (i-1)).after(
                        await $('#startList').after(
                          '<div id="entry'+i+'" class="col-12 mt-2"><h4 class="progress-title">'  +playerName+ '<font style="color:#ccff00;"> +' +theirReward+' '+TOKENSYMBOL+ '</font> / <font style="color:#f442b3;">' +theirKms+ 'km + '+theirMins+'mins</font></h4><div class="progress-item"><div class="progress"><div class="progress-bar bg-blue" role="progressbar" style="width:' +theirProgress+ '%;" aria-valuenow="' +theirProgress+ '" aria-valuemin="0" aria-valuemax="100"><span><img height="40" width="40" src="../app/assets/images/'+avatar+'.png"> </span></div></div></div></div>'
                        );
                      }                      
                    }
                    else{
                      console.error(error);
                    }
                  }
                );
                //---/ call that player
              }
              else{
                console.error(error);
              }
            }
          );
        }//end for
        //---/ get other players
      }
      else{
        console.error(error);
      }
    }
  );
  //---/ get goal params  
}

function makeSpendPage(){

}

function makeOrdersPage(){

}

function makeAdminPage(){

}


//datepicker initializer
var first = new Date();
first.setDate(first.getDate() + 1);
//$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$("#time").click(function(){
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  console.log(time);
})

function showCookies(){
  console.log("access_token: "+Cookies.get('access_token'));
  console.log("stravaID: "+Cookies.get('stravaID'));
  console.log("stravaUsername: "+Cookies.get('stravaUsername'));
  console.log("userWallet: "+Cookies.get('userWallet'));
}

var correctNonce = 0;
function updateNonce(){
  web3.eth.getTransactionCount(Cookies.get('userWallet')).then(nonce => {
    correctNonce = nonce;
  });
  console.log("nonce is: "+correctNonce);
}

//transaction is mined successfully --> correctNonce++;

//sanity check for debugging
//console.log(NcenoBrands);

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

$("#joinModBtn").hide();
$("#joinChecker").on('click', function(){
  if($("#joinChecker").is(':checked')) {
    $("#joinModBtn").show(); 
  } 
  else {
    $("#joinModBtn").hide(); 
  }
});



//brands join
$("#joinModBtn").click(function() {
  NcenoBrands.methods.join(
    _goalID, 
    Cookies.get('stravaID'), 
    $("#nameField").val(),
    $('input[name="avatarRadio"]:checked').val(), 
    $("#codeField").val())
  .send({from: Cookies.get('userWallet'), gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){

        $("#joinModBtn").hide();
        $("#codeField").hide();
        $("#nameField").hide();
        $("#joinLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){ 
    console.log(receipt.status);
    if(receipt.status === true){
      updateNonce();
      $("#joinLoader").hide();
      //$("joinChallenge").hide();
    }
    else{
      $("#joinChallenge").hide();
      $("#joinLoader").hide();
      $("#codeField").hide();
      $("#nameField").hide();
      $('#joinPrompt').html('<p>Sorry, invite code invalid or challenge has stopped.</p>');
      console.log("join error.");
    } 
  }).once('error', function(error){console.log(error);});
});


var targetName;
var targetPrice;
function setTarget(item){
  targetName = item.name;
  targetPrice = item.price;
}

function buy(){
  //deposit tokens here...
  AleToken.methods.transfer(
    adminWallet,
    targetPrice
  )
  .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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
      //---begin make order
        NcenoBrands.methods.makeOrder(
          goalID, 
          companyID, 
          web3.utils.padRight(web3.utils.randomHex(3),6),
          stravaID, 
          targetName, 
          targetPrice
        ).send({from: Cookies.get('userWallet'), gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
          function(error, result) {
            if (!error){

              $("#joinChallenge").hide();
              $("#codeField").hide();
              $("#nameChangeField").hide();
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
          }
          else{
            $("#joinChallenge").hide();
            $("#codeField").hide();
            $("#nameChangeField").hide();
            $('#joinChallengeFail').html('<p>Sorry, invite code invalid or challenge has stopped.</p>');
            console.log("join error.");
          } 
        }).once('error', function(error){console.log(error);});
      //---end makeorder
    }
    else{
      console.log('error. not enough funds?');
    }
  });
}

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
  .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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
      .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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



//helper function that populates the manage page with all the goodies. needs work.
function makePage(){
  makeList();
  selectedChallenge();
  updateNonce();
  //quickStats();
  getToken();
}

var goalid;




//searches for a specific goal and displays it with an option to join.
//also populates the join modal.
var stakeweiSearched;
function search(){

  $("#request").show();
  var goalid = web3.utils.padRight($('#searchField').val(),34)

  NcenoBrands.methods.getGoalParams(goalid)
  .call({from: Cookies.get('userWallet')},
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
  .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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




///////////////////////////////////////
//////////////vvvvvvvvvv gapAdjust()
///////////////////////////////////////


//_actID --> activeTime0, adjHR1
async function gapAdjust(_actID){
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

      //---- /gap detection -----
    } 
  });
  xhr2.open("GET", 'https://www.strava.com/api/v3/activities/'+_actID+'/streams?keys=heartrate,time&series_type=time&key_by_type=true');
  xhr2.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
  xhr2.send(stuff2);
}
///////////////////////////////////////
//////////////^^^^^^^^^^ gapAdjust()
///////////////////////////////////////








///////////////////////////////////////
//////////////vvvvvvvvv getActivities()
///////////////////////////////////////
var speedLimit = 4.5; //in m/s
var speedLow = 1.4; //in m/s
var BPMthresh = 99; 
var sesLow = 1200; //in s
var HRreward = 3;
var KMreward = 1;
var placeholderDate = new Date();
placeholderDate.setDate(placeholderDate.getDate() - 56); //can change "1" day to "20" days for testing.
var yesterday =parseInt(parseInt(placeholderDate.getTime())/1000);
var nowDate = parseInt(parseInt(new Date().getTime())/1000);

var HR = new Array();  //ID0, avgHR1,    mins2, timestamp3, reward4, valid5
var GPS = new Array(); //ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
var toLog = new Array(3);


//---- start the function
async function getActivities(){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  await xhr.addEventListener("readystatechange", async function(){
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      //clean the data and make a list of valid workouts.
      /*var HR = new Array();  //ID0, avgHR1,    mins2, timestamp3, reward4, valid5
      var GPS = new Array(); //ID0, avgSpeed1, dist2, timestamp3, reward4, valid5*/
      let i=0;
      let j=0;
      let k=0;
      
      while(i<data.length){
        if(data[i].manual == false && data[i].has_heartrate == true){
          var HRvalid= false;
          if(data[i].average_heartrate>BPMthresh && data[i].elapsed_time>sesLow) {HRvalid =true;}
          HR.push([data[i].id, data[i].average_heartrate, data[i].elapsed_time, data[i].start_date, HRreward*data[i].elapsed_time/600, HRvalid]); //need to adjust time, hr, value, validity
          j++;
        }
        if(data[i].manual == false && data[i].distance > 0){
          var GPSvalid= false;
          if(data[i].distance>1000 && data[i].average_speed<speedLimit && data[i].average_speed>speedLow) {GPSvalid =true;}
          GPS.push([data[i].id, data[i].average_speed, data[i].distance, data[i].start_date, KMreward*data[i].distance/1000, GPSvalid]);
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

      //find the max
      var GPSMaxID = null;
      var hrMaxID = null;
      var hrMaxVal=0;
      var GPSMaxVal=0;

      var avgHRmax = 0;
      var elapsed_timeMax = 0;
      var timestampMax = null;
      var avgSpeedMax = 0;
      var distMax = 0;

      if(j>0){
        HR.forEach(function(_H){
          if(_H[5]==true && _H[4]>hrMaxVal){
            hrMaxID = _H[0];
            hrMaxVal=_H[4];
          }
        });
      }

      //loop through GPS[m]
      if(k>0){
        GPS.forEach(function(_G){
          if(_G[5]==true && _G[4]>GPSMaxVal){
            GPSMaxID = _G[0];
            GPSMaxVal=_G[4];
          }
        });
      }

      //compare the max values and return the id of the best one
      var bestID = null;
      var bestVal = 0;
      var identifier = null;

      if(GPSMaxVal>=hrMaxVal){
        bestVal = GPSMaxVal;
        bestID = GPSMaxID;
        identifier = "GPS";
      }
      else {
        bestVal = hrMaxVal;
        bestID = hrMaxID;
        identifier = "HR";
      }
      console.log("the best one is a "+identifier+" workout: "+bestID+", which is worth "+Math.round(bestVal)+" SUN tokens");

      //get the full details of that activity
      var dispHR;
      var dispMins;
      var dispTimeHours;
      var dispTimeMinutes;
      var dispSpeed;
      var dispDist;
      var dispValue;
      var period;

      data.forEach(function(_A){
        if(_A.id==bestID){
          //console.log(_A);
          dispHR = _A.average_heartrate; //needs to be adjusted
          dispMins = _A.elapsed_time; //may need adjusted
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
          _A.utc_offset/3600
          dispTimeMinutes = new Date(_A.start_date_local).getMinutes();
          dispSpeed = _A.average_speed;
          dispDist = _A.distance;
          dispValue = Math.round(bestVal);
        }
      });
      //console.log("display this: "+dispTime+" "+dispMins+" "+dispHR+" "+dispDist+" "+dispSpeed+" "+dispValue);
      if(dispHR!= null && dispHR!= 0) $("#dispHR").html(Math.round(dispHR)); 
      if(dispMins!= null && dispMins!= 0) $("#dispMins").html(Math.round(dispMins/60));
      $("#dispTime").html(dispTimeHours+':'+dispTimeMinutes);
      $("#period").html(period); 
      if(dispSpeed!= null && dispSpeed!= 0) $("#dispSpeed").html((dispSpeed*3.6).toFixed(1));
      if(dispDist!= null && dispDist!= 0) $("#dispDist").html((dispDist/1000).toFixed(1)); 
      $("#dispValue").html(dispValue); 
    }
  });
  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
  xhr.send(stuff);
}

///////////////////////////////////////
//////////////^^^^^^^^^^ getActivities()
///////////////////////////////////////










///////////////////////////////
//-----begin log-in logic
///////////////////////////////

$("#loaderGlobal").hide();
$("#openWalletGlobal2").hide();
//initialize portis
//const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'rinkeby', { gasRelay: true, scope: ['email'] });
//const web3 = new Web3(portis.provider);



//set auth creds if they exist
var access_token;
if(Cookies.get('access_token') != undefined){
  access_token = Cookies.get('access_token');
} 

var stravaID; 
if(Cookies.get('stravaID') != undefined){
  stravaID = Cookies.get('stravaID');
}
var stravaUsername; 
if(Cookies.get('stravaUsername') != undefined){
  stravaUsername = Cookies.get('stravaUsername');
}
var userWallet;
if(Cookies.get('userWallet') != undefined){
  userWallet = Cookies.get('userWallet');
}

var code;
window.onload = function(){


  //$("#brandsPrompt").html('<p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
  //case 1- if you're missing everything,
  if(Cookies.get('access_token') == undefined || Cookies.get('stravaID') == undefined ){ 
    console.log("doing case 1: missing everything...");
    //$("#debug").html('<p>doing case 1: missing everything...</p><br><p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
    $("#stravaBtnGlobal").show();
    $("#userPrompt").html('');
    $("#signOut").hide();
    $("#brandsPrompt").html('<p style="color:white;">You need to log in! <a style="color:#ccff00;" href="https://www.nceno.app/workplace.html">click here</a></p>');

    //and you've been redirected from strava auth page,
      //@config  the path (and file name) will change if this is a corp well challenge
    if (
         window.location.href != 'https://www.nceno.app/corps/cw_demo.html#' 
      && window.location.href != 'https://www.nceno.app/corps/cw_demo#'
      && window.location.href != 'https://nceno.app/corps/cw_demo#'
      && window.location.href != 'https://nceno.app/corps/cw_demo.html#'

      && window.location.href != 'https://www.nceno.app/corps/cw_demo.html' 
      && window.location.href != 'https://www.nceno.app/corps/cw_demo'
      && window.location.href != 'https://nceno.app/corps/cw_demo'
      && window.location.href != 'https://nceno.app/corps/cw_demo.html'){
      //capture the code,
      code = window.location.href.split('=')[2].split('&')[0];
      console.log(code);
      //redeem it for the token,
      getTokenGlobal();
      //then log into portis. (included in gettoken)
    }
  }
  
  //case 2- missing portis only
  else if( Cookies.get('stravaUsername') == undefined || Cookies.get('userWallet') == undefined){
    console.log("doing case 2: missing portis only...");
    //$("#debug").html('<p>doing case 2: missing portis...</p><br><p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
    $("#stravaBtnGlobal").hide();
    $("#signOut").hide();
    $("#brandsPrompt").html('<p style="color:white;">You need to log in! <a style="color:#ccff00;" href="https://www.nceno.app/workplace.html">click here</a></p>');
    showPortisGlobal();
  }
  //case 3- nothing missing
    //-----disable this block when testing.------
  else if(Cookies.get('access_token') != undefined && Cookies.get('stravaID') != undefined && Cookies.get('stravaUsername') != undefined){
    console.log("doing case 3: missing nothing...");
    //$("#debug").html('<p>doing case 3: missing nothing...</p><br><p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
    
    $("#stravaBtnGlobal").hide();
    $("#openWalletGlobal2").show();
    $("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</h5>');
    $("#brandsPrompt").html('<p><font style="color:white;">Connection successful. <br>Welcome, </font>'+Cookies.get('stravaUsername')+'</p>');
    
    updateNonce();
    //makeWorkoutPage();
      //----this hides the join button if you're a player.
      NcenoBrands.methods.playerStatus(_goalID, Cookies.get('stravaID'))
      .call({from: Cookies.get('userWallet')},
        function(error, result) {
          if (!error){
            console.log("player joined already: "+result);
            if(result[0]==true){
              $("#joinBtn").hide();
            }
          }
        }
      );
      //---/ hide join button
  }

  //we can only use window.onload once... so move the slider initialization here
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
    //tooltipFormat: "tooltipVal4",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
}

//var inSixHours = 0.24;
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
      Cookies.set('access_token', access_token
        //,{expires: inSixHours}
      );

      //set the stravaID in cookies
      stravaID = data.athlete.id;
      Cookies.set('stravaID', stravaID);

      $("#stravaBtnGlobal").hide();
      if(Cookies.get('stravaUsername') == undefined){
        showPortisGlobal();
      }else{
        $("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</h5>');
        $("#brandsPrompt").html('<p><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</p>');
      }
      console.log("Nceno User ID: "+Cookies.get('stravaID')+"   Nceno Email: "+portisEmail+"   Wallet address: "+Cookies.get('userWallet'));
    }
  });
  //using joe nceno 
  xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=33084&client_secret=e4668610b5d6bee15fcd68d0cb88a1f656ae1ad3&code='+code+'&grant_type=authorization_code');
  //xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(stuff);
}

var portisEmail;
//signs user into portis and stores their wallet address as the default wallet address in web3
function showPortisGlobal() {
  $('#loaderGlobal').show();
  setTimeout("$('#loaderGlobal').hide();", 7500);
  // will only open the portis menu
  portis.showPortis(() => {  
  });
  portis.onLogin((walletAddress, email) => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      portisEmail = email;
      stravaUsername= portisEmail.substring(0, portisEmail.lastIndexOf("@"));
      Cookies.set('stravaUsername', stravaUsername);
      Cookies.set('userWallet', Cookies.get('userWallet'));

      //$("#portisBtn").hide();
      updateGasPrice();

      //if this fills in the blanks for auth creds,
      if(Cookies.get('access_token') != undefined && Cookies.get('stravaID') != undefined){
        //say so.
        $("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</h5>');
        $("#brandsPrompt").html('<p><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</p>');
      }
      $("#openWalletGlobal2").show();
      
    });
  });
}

function showWallet(){
  $('#loaderGlobal').show();
  setTimeout("$('#loaderGlobal').hide();", 3000);
    portis.showPortis(() => {  
    });
}

///////////////////////////////
//-----/end log-in logic
///////////////////////////////