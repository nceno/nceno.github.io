//datepicker initializer
var first = new Date();
first.setDate(first.getDate() + 1);
//$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$('[data-toggle="datepicker"]').datepicker({'autoHide': true});
$("#time").click(function(){
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  console.log(time);
})

//var nonce = 0;
//web3.eth.getTransactionCount("web3.eth.defaultAccount").then(nonce = result);
//console.log("nonce is: "+nonce);

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
      localize();
      getToken();
      $("#portisBtn").hide();

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
$("#claimSuccess").hide();
$("stravaSuccess").hide();
$("stravaOk").hide();
$("portisSuccess").hide();
$("#request").hide();
$("#joinLoader").hide();
$("#joinSuccess").hide();
$("#joinSoonLoader").hide();
$("#joinSoonSuccess").hide();
$("#makeAcctBtn").hide();
$("#openWallet").hide();
$("#portisLoader").hide();

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
  .send({from: web3.eth.defaultAccount, gas: 400000, gasPrice: 3000000000},
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
    Math.round(ethPrice*100) //eth price in pennies. Gets rid of decimals
  )
  .send({from: web3.eth.defaultAccount, gas: 4000000, gasPrice: 3000000000, value: usdStakeInWei},
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
      $("#createLoader").hide();
      $("#createSuccess").show();
      $("#hostBtn").hide();
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
  updateEthPrice();
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  //echo modal
  $("#host").tab('show');
  $('#popupCreate').modal('show');

  $("#goalEcho").html(
    "You're commiting $" + $("#sliderStake").roundSlider("getValue") + " to working out for " + 
    $("#sliderMins").roundSlider("getValue") +"mins " + $("#sliderSes").roundSlider("getValue")+" times per week for "+ 
    $("#sliderWks").roundSlider("getValue")+  " weeks, starting automatically on "+ $("#dateChoice").datepicker('getDate', true) +
    ". The challenge ID is: "+ goalID+"."
  );
}

/*//populates the modal when you want to join a searched goal
function srEcho(){
  $("#srEcho").html(
    "You're commiting $" + $("#srStake").val() + " to working out for " + 
    $("#srMins").val() +"mins " + $("#srSes").val()+" times per week for "+ 
    $("#srWks").val()+  " weeks, starting automatically on "+ $("#srStart").val()
  );
}*/

//joins the searched goal
function joinSearch(){
  updateEthPrice();
  goalid = web3.utils.padRight($('#searchField').val(),34);
  Nceno.methods.getGoalParams(
    goalid
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        var stakewei= result[1];
        Nceno.methods.join(
          goalid,
          stravaID,
          ethPrice
        )
        .send({from: web3.eth.defaultAccount, gas: 3000000, gasPrice: 3000000000, value: stakewei},
          function(error, result) {
            if (!error){
              $("#joinSearch").hide();
              $("#srCancelBtn").hide();
              $("#joinLoader").show();
              console.log(result);
            }
            else
            console.error(error);
          }
        ).once('confirmation', function(confNumber, receipt){
          console.log(receipt.status);
          if(receipt.status === true){
            $("#joinLoader").hide();
            $("#joinSuccess").show();
            $("#makeAcctBtn").hide();
          }
          else{
            $("#acctLoader").hide();
            $("#makeAcctBtn").hide();
            console.log("Challenge already started, user already is a participant, or else message value is less than intended stake.");
          } 
           })
          .once('error', function(error){console.log(error);});;
      }
      else
      console.error(error);
    }
  ); 
}

//joins the browsed goal
function joinSoon(){
  updateEthPrice();
  goalid = browsedGoal;
  Nceno.methods.getGoalParams(
    goalid
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        //var stakewei= result[1];
        Nceno.methods.join(
          goalid,
          stravaID,
          ethPrice
        )
        .send({from: web3.eth.defaultAccount, gas: 3000000, gasPrice: 3000000000, value: stakewei},
          function(error, result) {
            if (!error){
              $("#joinSoon").hide();
              $("#soonCancelBtn").hide();
              $("#joinSoonLoader").show();
              console.log(result);
            }
            else
            console.error(error);
          }
        ).once('confirmation', function(confNumber, receipt){ 
          $("#joinSoonLoader").hide();
          $("#joinSoonSuccess").show();
           })
          .once('error', function(error){console.log(error);});;
      }
      else
      console.error(error);
    }
  ); 
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
  randGoalID();
}

//generates the typed quick stats at the top of the manage tab
function quickStats(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.fitbit.com/1/user/'+ fitbitUser +'/activities/heart/date/today/1d.json');
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.onload = function() {
    if (xhr.status === 200) {
      
      //activity minutes  
      var data = JSON.parse(xhr.responseText);
      var obj = [data];
      var fatBurn = obj[0]["activities-heart"][0].value.heartRateZones[1].minutes;
      var cardio = obj[0]["activities-heart"][0].value.heartRateZones[2].minutes;
      var peak = obj[0]["activities-heart"][0].value.heartRateZones[3].minutes;
      var sessionMins = fatBurn + cardio + peak;      
      $("#qsMins").html(sessionMins);
      console.log("total session minutes to be logged: "+sessionMins);

      //active challenges
      var active = 0;
      for (let j = 0; j < 20; j++){
      Nceno.methods.getActiveGoal(stravaID, j).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          active++;
        }
        $("#qsActive").html(active);
      });}

      //completed challenges
      var completed = 0;
      var goals2 = new Array();
      for (let k = 0; k < 20; k++){
      Nceno.methods.getCompletedGoal(stravaID, k).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals2[k] = result;
          completed++;
        }
      });}

      //the rest
      var successCount=0; 
      var sesPerWk=0;
      var lostStake=0;
      var bonusTotal=0;
      for (let i = 0; i < completed; i++){
      Nceno.methods.successPerGoal(stravaID, goals2[i]).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          successCount+=result[0];
          sesPerWk+=result[1];
          lostStake+=result[2];
          bonusTotal+=result[3];
        }
      });}
      $("#qsAdherence").html(successCount/sesPerWk*100);
      $("#qsLost").html(lostStake);
      $("#qsGain").html(bonusTotal);
      $("#qsProfit").html(bonusTotal-lostStake);
    }
  };
  xhr.send();
}

//helper function that populates the manage page with all the goodies. needs work.
function makePage(){
  makeList();
  selectedChallenge();
 
  //quickStats();
  getToken();
}
var wkLimit = 0;
var currentWeek = 0;
function makeWktl(){

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
 if(currentWeek<=wkLimit+1){
    $('#'+pastwkclaimKey).show();
  }
 
  var mostRecentWk = 0;
  if(currentWeek>wkLimit){mostRecentWk = wkLimit;}
  else mostRecentWk = currentWeek;

  for (let i = 0; i < mostRecentWk; i++){
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

    var sessions = 0;
    var wks = 0;
    var USDstake = 0;
    var competitors = 0;
    var wkBonus = new Array();
    var wkPayout = new Array();
    var lockedPercentWk = new Array();
    var successesWk = new Array();
    var winnersWk = new Array();


    //overwrite artifacts from perviously selected goal if current has lower compcount.
    for (let k = 0; k < 10; k++){
      var n = k+1;
      var adhKey = 'adhP'+n;
      var nameKey = 'nameP'+n;
      var flagKey = 'flagP'+n;
      var bonusKey = 'bonusP'+n;
      var payKey = 'payP'+n;
      var lostKey = 'lostP'+n;
                        
      $('#'+adhKey).html('');
      $('#'+nameKey).html('');
      $('#'+flagKey).html('');
      $('#'+bonusKey).html('');
      $('#'+payKey).html('');
      $('#'+lostKey).html('');
      console.log("clearing leaderboard...");
    }

    Nceno.methods.getGoalParams(goalid)
    .call({from: web3.eth.defaultAccount},
        function(error, result) {
        if (!error){
          //echo challenge
          var compcount = result[5];
          var tstamp = new Date(result[4]*1000);
          //var buyin = Math.round(result[1]*result[5]/100000000000000000000);
          wkLimit = result[3];
          $("#echStake").html("$"+result[1]);
          $("#echWks").html(result[3]+" wks");
          $("#echSes").html(result[2]+" x/wk");
          $("#echMins").html(result[0]+ " mins");
          $("#echComp").html(result[5]);
          $("#echStart").html(tstamp.toDateString());
          $("#dashboard").show();
          console.log("step 1/4, got GoalParams...."); //*********************************************

          //set the timeline variables
          sessions = result[2];
          USDstake = result[1];
          competitors = result[5];
          wks = result[3];

          //set current challenge week globally
          currentWeek = Math.floor((Date.now()/1000 - result[4])/604800)+1;
          //currentWeek = (Date.now()/1000 - result[4])/604800;
          console.log("blockchain says we're in week: "+currentWeek);
          makeWktl();
       
          Nceno.methods.getParticipants(goalid)
          .call({from: web3.eth.defaultAccount},
            function(error, result) {
              if (!error){
                
                var ids = new Array();
                var names = new Array();
                var flags = new Array();
                
                ids = result[0];
                names = result[1];
                flags = result[2];
                console.log("step 2/4, got Participants...");

                
                for (let k = 0; k < compcount; k++){
                  console.log("compcount =" +compcount);
                  console.log("k= "+k);
                  Nceno.methods.getMyGoalStats1(ids[k], goalid)
                  .call({from: web3.eth.defaultAccount},
                    function(error, result) {
                      if (!error){
                        
                        var adherence = new Array();
                        adherence[k] = result[0];
                        console.log("successes= "+result[2]);//debug
                        console.log("step 3/4, got GoalStats1..."); 
                        
                        Nceno.methods.getMyGoalStats2(ids[k], goalid)
                        .call({from: web3.eth.defaultAccount},
                          function(error, result) {  
                            if (!error){
                              var bonusTotal = new Array();
                              var totalPay = new Array();
                              var lostStake = new Array();

                              bonusTotal[k] = result[3];
                              totalPay[k] = result[4]/100;
                              lostStake[k] = result[1]/100;
                              console.log("payouts= "+result[0]); //debug
                              console.log("lost= "+result[1]); //debug
                              console.log("step 4/4, got GoalStats2...");

                              if(k>=0){
                                //set the timeline variables
                                wkBonus = result[2];
                                wkPayout = result[0];
                              }

                              var convertedName = web3.utils.hexToUtf8(names[k]);
                              var convertedFlag = web3.utils.hexToUtf8(flags[k]).toLowerCase();

                              var n = k+1;
                              var adhKey = 'adhP'+n;
                              var nameKey = 'nameP'+n;
                              var flagKey = 'flagP'+n;
                              var bonusKey = 'bonusP'+n;
                              var payKey = 'payP'+n;
                              var lostKey = 'lostP'+n;
                              

                              $('#'+adhKey).html(adherence[k]+'%');
                              $('#'+nameKey).html(convertedName);
                              $('#'+flagKey).html('<img src="https://ipdata.co/flags/'+convertedFlag+'.png">');
                              $('#'+bonusKey).html('$'+bonusTotal[k]);
                              $('#'+payKey).html('$'+totalPay[k]);
                              $('#'+lostKey).html('$'+lostStake[k]);

                              if(k>=0){
                                //get the timeline variables and set them
                                Nceno.methods.getGoalArrays(goalid, stravaID)
                                .call({from: web3.eth.defaultAccount},
                                  function(error, result) {
                                    if (!error){
                                      lockedPercentWk = result[0];
                                      successesWk = result[1];
                                      winnersWk = result[2];

                                      //populate the timeline
                                      for (let k = 0; k < currentWeek; k++){
                                        var n = k+1;
                                        var complKey = 'compl'+n;
                                        var lockKey = 'lock'+n;
                                        var bonusKey = 'bonus'+n;
                                        var unKey = 'un'+n;
                                        var finKey = 'fin'+n;
                                        var lost = 0;
                                        if(currentWeek>k+1){
                                          lost = lockedPercent[k]*USDstake-wkPayout[k]/100;
                                        }
                                        else lost = 0;
                                        
                                       
                                                    
                                        $('#'+complKey).html(successesWk[k] +" of "+ sessions);
                                        $('#'+lockKey).html("$"+lockedPercentWk[k]*USDstake/100);
                                        $('#'+bonusKey).html("$" +wkBonus[k]/100);
                                        $('#'+unKey).html("$" +wkPayout[k]/100);
                                        $('#'+finKey).html(winnersWk[k] +" of "+ competitors);
                                        $('#'+finKey).html("$" +lost);
                                        
                                        console.log("timeline populated...");
                                      }

                                      //make chart data ****************************************************************************
                                      //x axis
                                      var xaxis = new Array();
                                      for(let i = 0; i<wks; i++){
                                        xaxis[i] = "Week "+i+1;
                                      }

                                      //Cumulative % stake returned
                                      var roi = new Array();
                                      for(let i = 0; i<wks; i++){
                                        roi[i] = (wkPayout[i]+wkBonus[i])/USDstake;
                                      }

                                      //% Competitors finished the week
                                      var finishers = new Array();
                                      finishers = winnersWk.map(function(value) Math.round(100*value/competitors));
                                      //********************************************************************************************

                                    }
                                    else{
                                      console.log("step 5/5 getGoalArrays failed.");  
                                      console.error(error);
                                    }
                                });
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
function search(){
  $("#request").show();
  var goalid = web3.utils.padRight($('#searchField').val(),34)

  Nceno.methods.getGoalParams(goalid)
  .call({from: web3.eth.defaultAccount},
      function(error, result) {
      if (!error){
        //echo challenge

        var tstamp = new Date(result[4]*1000);
        var buyin = Math.round(result[1]*result[5]/100000000000000000000);

        $("#srStake").html("$"+result[1]);
        $("#srWks").html(result[3]+" wks");
        $("#srSes").html(result[2]+" x/wk");
        $("#srMins").html(result[0]+ " mins");
        $("#srComp").html(result[6]);
        $("#srStart").html(tstamp.toDateString());
        if(result[4]*1000>Date.now()){$("#joinSearch").show();}

        $("#srEcho").html(
          "You're commiting $" + buyin + " to working out for " + 
          result[0] +"mins " + result[2]+" times per week for "+ 
          result[3]+  " weeks, starting automatically on "+ tstamp.toDateString()
        );
      }
      else
      console.error(error);
  }); 
}

//populates the challenges starting soon table
//var browsePopulated
var selBrowsedGoal = 0x0000000000000000000000000000000000000000000000000000000000000000;
async function browse(){

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
      $('#'+wksKey).html(result[4]+' wks');
      $('#'+sesKey).html(result[3]+' x/wk');
      $('#'+minKey).html(result[1]+' min');
      $('#'+pplKey).html(result[6]);
      $('#'+startKey).html(tstamp.toDateString());
      $('#'+btnKey).show();
      $('#'+idKey).val(result[0]);
      console.log($('#idNumberU1').val());
      console.log($('#idNumberU2').val());
      console.log($('#idNumberU3').val());
      console.log($('#idNumberU4').val());
      console.log($('#idNumberU5').val());
      console.log($('#idNumberU6').val());
      console.log($('#idNumberU7').val());
      console.log($('#idNumberU8').val());
      console.log($('#idNumberU9').val());
      console.log($('#idNumberU10').val());

    }   
  }
}

var browsedGoal;
function setGoalID(id){
  browsedGoal= id;
  $("#soonEcho").html(
    "You're commiting $" + buyin + " to working out for " + 
    result[0] +"mins " + result[2]+" times per week for "+ 
    result[3]+  " weeks, starting automatically on "+ tstamp.toDateString()
  );
}

//button to claim lost stake from previous week. needs work.
$("#claimBtn").click(function() {
  var goalid = web3.utils.padRight($("#goalCategories").val(),34);
  //function call:
  Nceno.methods.claim(
    goalid,
    stravaID
  )
  .send({from: web3.eth.defaultAccount, gas: 2000000, gasPrice: 3000000000},
    function(error, result) {
      if (!error){
        $("#claimBtn").hide();
        $("#claimLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){

    console.log(receipt.status);
    if(receipt.status === true){
      $("#claimLoader").hide();
      $("#claimSuccess").show();
      $("#makeAcctBtn").hide();
    }
    else{
      $("#acctLoader").hide();
      $("#makeAcctBtn").hide();
      $('#claimFail').html('<p>Transaction failed. Your wallet does not match your Strava account, you are not a competitor in this challenge, you were not 100% adherent for the week, or you already claimed your bonus for this week.</p>');
      console.log("wallet-user mismatch, user not a competitor, user not 100% adherent for the week, or user already claimed bonus for the week.");
    }  
    
    console.log("lost stake claim was successful!"); })
    .once('error', function(error){console.log(error);});;
});

//not sure if using window.onload correctly... but,
//this initializes a bunch of stuff as soon as the user navigates to the app page.

window.onload = function() {

  portis.onLogin((walletAddress, email) => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      console.log("default: " + web3.eth.defaultAccount);
      localize();
      getToken();
      $("#portisBtn").hide();
      $("#portisSuccess").html("Wallet address: "+web3.eth.defaultAccount.slice(0, 22)+" "+web3.eth.defaultAccount.slice(23, 42));
    });
  });

  //charts
  var ctx1 = document.getElementById('canvas1').getContext('2d');
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
            backgroundColor: '#ccff00',
            borderColor: '#ccff00',
            fill: true
        }, {
            //line data
            label: 'Your cumulative % stake earned back',
            yAxisID: 'B',
            //data: [2, 7, 12, 26, 26, 30, 45, 45, 78, 85, 85, 90],
            data: roi,
            backgroundColor: '#f442b3',
            borderColor: '#f442b3',
            fill: false,
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
          text: 'Weekly payouts'
        }
      }
    }
  );

  var ctx2 = document.getElementById('canvas2').getContext('2d');
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
            data: lockedPercentWk,
            backgroundColor: '#ccff00',
            borderColor: '#ccff00',
            fill: true
        }, {
            //line
            label: '% Competitors finished the week',
            yAxisID: 'B',
            //data: [90, 95, 60, 40, 55, 70, 30, 45, 40, 30, 20, 43],
            data: finishers,
            type: 'line',
            backgroundColor: '#f442b3',
            borderColor: '#f442b3',
            fill: false
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
          text: 'Weekly payouts'
        }
      }
    }
  );

  //sliders
  $("#sliderMins").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "24,12",
    handleShape: "square",
    min: 20,
    max: 120,
    step: 1,
    value: 45,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal1"
  });
  $("#sliderSes").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "24,12",
    handleShape: "square",
    min: 2,
    max: 7,
    step: 1,
    value: 3,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal2"
  });
  $("#sliderWks").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "24,12",
    handleShape: "square",
    min: 2,
    max: 12,
    step: 2,
    value: 6,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal3"
  });
  $("#sliderStake").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "24,12",
    handleShape: "square",
    //min: 10,*********************************************smaller values used for testing
    //max: 300,
    min: 1,
    max: 20,
    step: 1,
    //value: 55,******************
    value: 2,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal4"
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
//gets the current price of ETH in USD. Should be called as close as possible to goal deployment.
function updateEthPrice() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var resp = JSON.parse(xhr.responseText);
      ethPrice = resp.USD;
      console.log(this.responseText);
      console.log(ethPrice);
      //$('#hostBtn').show();
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

function getToken(){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      access_token = data.access_token;
      stravaID = data.athlete.id;
      stravaUsername = data.athlete.username;
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
placeholderDate.setDate(placeholderDate.getDate() - 5);
var yesterday =parseInt(parseInt(placeholderDate.getTime())/1000);
var nowDate = parseInt(parseInt(new Date().getTime())/1000);

function getActivities(){
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

      for(let i=0; i<data.length; i++){
        console.log("["+data[i].id+", "+data[i].average_heartrate+", "+data[i].elapsed_time/60+"]");
        if(data[i].average_heartrate>100 && data[i].elapsed_time/60>=goalMovingTime){
          cleaned[i] = [data[i].id, data[i].average_heartrate, data[i].elapsed_time/60];
          //cleaned.push([data[i].id, data[i].average_heartrate, data[i].moving_time/60]);
        }
      }
      //if there is at least one valid workout, log it in the contract, triggering payout.
      if(cleaned.length>0){
        //console.log(goalid+","+stravaID+","+ cleaned[0][0]+","+Math.round(cleaned[0][1])+","+Math.round(cleaned[0][2]));
        console.log("Good news, your workout is being logged for a payout!")
        

        //log the data to get a payout
        Nceno.methods.log(
          goalid,
          //$('#goalCategories').val();
          stravaID,
          cleaned[0][0],
          Math.round(cleaned[0][1]),
          Math.round(cleaned[0][2])
        )
        .send({from: web3.eth.defaultAccount, gas: 6000000, gasPrice: 3000000000},
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
        ).once('confirmation', function(confNumber, receipt){
          console.log(receipt.status);
          if(receipt.status === true){
            console.log("You just unlocked 4% of your stake. Check your wallet in a couple minutes.");
            //refreshStats();
            //refreshLeaderboard();

            /*$("#joinLoader").hide();
            $("#joinSuccess").show();
            $("#makeAcctBtn").hide();*/
          }
          else{
            /*$("#acctLoader").hide();
            $("#makeAcctBtn").hide();*/
            console.log("wallet-user mismatch, user is not competitor, goal has not started yet, or goal has already finished.");
          } 
        })
        .once('error', function(error){console.log(error);});;
      }
      //if no valid workouts, don't log, and alert the user.
      else{
        console.log("No valid workouts today...");

      } 
    }
  });

  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}