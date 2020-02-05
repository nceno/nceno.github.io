//const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'rinkeby', { gasRelay: true, scope: ['email'] });
//const web3 = new Web3(portis.provider);


async function makeWorkoutPage(){
  //---get goal params
  
  //var _goalID = "0xccff00";

  await NcenoBrands.methods.getGoalParams(_goalID)
  .call({from: Cookies.get('userWallet')},
    async function(error, result) {
      if (!error){
        var start = parseInt(result[0]);
        var dur = parseInt(result[1]);
        var tokenCap = parseInt(result[2]);
        var compcount = parseInt(result[3]);
        var remainingTokens = parseInt(result[4]);
        var bpmReward = parseInt(result[5]); //per 10mins
        var kmReward = parseInt(result[6]); //per km

        //reset the leaderboard
        $('#entry0').empty();
        for(var j=1; j<compcount+1; j++){
          $('#entry'+j).remove();
        }

        //---get other players
        for(var i=0; i<compcount; i++){

          await NcenoBrands.methods.getIndexedPlayerID(_goalID, i)
          .call({from: Cookies.get('userWallet')},
            async function(error, result) {
              if (!error){
                //console.log(result);
                var playerID = result[0]; 
                var playerName = result[1];
                //---call that player
                await NcenoBrands.methods.getPlayer(_goalID, playerID)
                .call({from: Cookies.get('userWallet')},
                  function(error, result) {
                    if (!error){
                      //console.log(result);
                      var theirKms = result[0]; 
                      var theirMins = result[1]; 
                      var theirReward = result[2];
                      var theirProgress = Math.round(100*theirReward/tokenCap);
                      var avatar = result[4];

                      //theirLastLogTime = result[3];
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

                      //.prepend first entry if it's not me
                      if(i==0){
                        console.log("first post.."+playerName+"...i= "+i);
                        $("#entry0").prepend(
                          '<h4 class="progress-title">'  +playerName+ '<font style="color:#ccff00;"> +' +theirReward+' '+TOKENSYMBOL+ '</font> / <font style="color:#f442b3;">' +theirKms+ 'km + '+theirMins+'mins</font></h4><div class="progress-item"><div class="progress"><div class="progress-bar bg-blue" role="progressbar" style="width:' +theirProgress+ '%;" aria-valuenow="' +theirProgress+ '" aria-valuemin="0" aria-valuemax="100"><span><img height="40" width="40" src="../app/assets/images/'+avatar+'.png"> </span></div></div></div>'
                        );
                      }else if(playerID == Cookies.get('stravaID', stravaID) && i>0){
                        //post to top if it's me
                        console.log("it's me..."+playerName+"...i= "+i);
                        $("#entry0").before(
                          '<div id="entry'+i+'" class="col-12 mt-2"><h4 class="progress-title">'  +playerName+ '<font style="color:#ccff00;"> +' +theirReward+' '+TOKENSYMBOL+ '</font> / <font style="color:#f442b3;">' +theirKms+ 'km + '+theirMins+'mins</font></h4><div class="progress-item"><div class="progress"><div class="progress-bar bg-blue" role="progressbar" style="width:' +theirProgress+ '%;" aria-valuenow="' +theirProgress+ '" aria-valuemin="0" aria-valuemax="100"><span><img height="40" width="40" src="../app/assets/images/'+avatar+'.png"> </span></div></div></div>'
                        );
                        //populate my quick stats .........
                        $("#progressPerc").html(theirProgress+'%');
                        $("#user").html(playerName);                
                        var days = Math.round((start+dur*86400-Date.now()/1000)/86400);
                        $("#daysLeft").html(days+" days");
                        $("#rewardSlot").html(theirReward+' SUN');
                        $("#potRem").html(remainingTokens+' SUN');
                        $("#leaderboardCount").html(compcount);

                      }
                      else {
                        //.after following entries
                        console.log("after..."+playerName+"... i= "+i);
                        $('#entry'+ (i-1)).after(
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

function makeHostPage(){

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


//brands join
$("#joinChallenge").click(function() {
  NcenoBrands.methods.join(
    goalID, 
    stravaID, 
    $("#nameChangeField").val(), 
    $("#codeField").val())
  .send({from: Cookies.get('userWallet'), gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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
      //$("joinChallenge").hide();
    }
    else{
      $("#joinChallenge").hide();
      $("#codeField").hide();
      $("#nameChangeField").hide();
      $('#joinChallengeFail').html('<p>Sorry, invite code invalid or challenge has stopped.</p>');
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
        .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 300000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
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
      console.log("Nceno User ID: "+stravaID+"   Nceno Email: "+portisEmail+"   Wallet address: "+Cookies.get('userWallet'));
    }
  });
  //joe nceno 
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