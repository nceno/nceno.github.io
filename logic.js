//datepicker initializer
var first = new Date();
first.setDate(first.getDate() + 1);
//$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$('[data-toggle="datepicker"]').datepicker({'autoHide': true});
$("#time").click(function(){
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  console.log(time);
})

//web3 definition would go here ----->>

//signs user into portis and stores their wallet address as the default wallet address in web3
function showPortis() {
  // will only open the portis menu
  web3.currentProvider.showPortis(() => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      //web3.eth.defaultAccount = '0x0b51bde2ee3ca800e9f368f2b3807a0d212b711a';
      console.log("default: " + web3.eth.defaultAccount);
      $("#portisBtn").hide();
      $("#portisSuccess").html("Wallet address: "+web3.eth.defaultAccount.slice(0, 22)+" "+web3.eth.defaultAccount.slice(23, 42));
    });
  })
}

//helper function that will hide the create account button if the user already made an account.
//i.e. if a fitbit ID already has a competitor object associated to it, this function hides the create button.
function checkUserbase(){
  Nceno.methods.userExists(
    userID
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        if(result)
          $("#makeAcctBtn").hide();
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
$("fitbitSuccess").hide();
$("portisSuccess").hide();
$("#request").hide();
$("#joinLoader").hide();
$("#joinSuccess").hide();
$("#joinSoonLoader").hide();
$("#joinSoonSuccess").hide();

//show create button only if user agrees to terms
$("#checker").on('click', function() {
if($("#checker").is(':checked')) {
  $("#createBtn").show(); 
} else {
  $("#createBtn").hide(); 
  }
});

//global variables for when a user auths with fitbit
var access_token
var fitbitUser 
var userID
             
//creating a competitor account from the input form and flag
$("#makeAcctBtn").click(function() {
  Nceno.methods.createCompetitor(
    userID,
    web3.utils.padRight(web3.utils.toHex($("#wearable").val()),34),
    web3.utils.padRight(web3.utils.toHex($("#name").val()),34),
    web3.utils.padRight(web3.utils.toHex($("#email").val()),34),
    web3.utils.padRight(web3.utils.toHex(flag),34))
  .send({from: web3.eth.defaultAccount, gas: 200000, gasPrice: 15000000000},
    function(error, result) {
      if (!error){
        $("#makeAcctBtn").hide();
        $("#acctLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).on('confirmation', function(confNumber, receipt){ 
    $("#acctLoader").hide();
    $("#acctSuccess").show();
    
    $("#makeAcctBtn").hide(); })
    .on('error', function(error){console.log(error);});
}); 

//creating a goal from the slider values and live ethereum price
var goalID = web3.utils.padRight(web3.utils.randomHex(3),6);
$("#hostBtn").click(function() {
  updateEthPrice();
  var msgValueHost = Math.floor($("#sliderStake").roundSlider("getValue")*1000000000000000000/ethPrice);
  var usdStakeInWei = msgValueHost.toString();
  var start = new Date($("#dateChoice").datepicker('getDate')).getTime() / 1000;

  Nceno.methods.createGoal(
    goalID,
    $("#sliderMins").roundSlider("getValue"),
    usdStakeInWei,
    $("#sliderSes").roundSlider("getValue"),
    $("#sliderWks").roundSlider("getValue"),
    start,
    userID,
    Math.floor((ethPrice*10000)*1/100)
  )
  .send({from: web3.eth.defaultAccount, gas: 3000000, gasPrice: 15000000000, value: usdStakeInWei},
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
  ).on('confirmation', function(confNumber, receipt){ 
    $("#createLoader").hide();
    $("#createSuccess").show();
    })
    .on('error', function(error){console.log(error);});;
});

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
  var goalid = web3.utils.padRight($('#searchField').val(),34);
  Nceno.methods.getGoalParams(
    goalid
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        var stakewei= result[1];
        Nceno.methods.joinGoal(
          goalid,
          userID
        )
        .send({from: web3.eth.defaultAccount, gas: 310000, gasPrice: 15000000000, value: stakewei},
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
        ).on('confirmation', function(confNumber, receipt){ 
          $("#joinLoader").hide();
          $("#joinSuccess").show();
           })
          .on('error', function(error){console.log(error);});;
      }
      else
      console.error(error);
    }
  ); 
}

//joins the browsed goal
function joinSoon(){
  var goalid = browsedGoal;
  Nceno.methods.getGoalParams(
    goalid
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        var stakewei= result[1];
        Nceno.methods.joinGoal(
          goalid,
          userID
        )
        .send({from: web3.eth.defaultAccount, gas: 310000, gasPrice: 15000000000, value: stakewei},
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
        ).on('confirmation', function(confNumber, receipt){ 
          $("#joinSoonLoader").hide();
          $("#joinSoonSuccess").show();
           })
          .on('error', function(error){console.log(error);});;
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
  if(populated = false){
    var goals1 = new Array();
    var goals2 = new Array();
    var goals3 = new Array();

    for (let i = 0; i < 15; i++){
      //upcoming
      Nceno.methods.getUpcomingGoal(userID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals1[i] = result;
          console.log(goals1[i] + " is an upcoming goal");
          
          $("#upcomingGoals").after('<option>'+ goals1[i].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });
      //active
      Nceno.methods.getActiveGoal(userID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals2[i] = result;
          console.log(goals2[i]  + " is an active goal");
          
          $("#activeGoals").after('<option>'+ goals2[i].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });
      //completed
      Nceno.methods.getCompletedGoal(userID, i).call({from: web3.eth.defaultAccount}, function(error, result){
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
      Nceno.methods.getActiveGoal(userID, j).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          active++;
        }
        $("#qsActive").html(active);
      });}

      //completed challenges
      var completed = 0;
      var goals2 = new Array();
      for (let k = 0; k < 20; k++){
      Nceno.methods.getCompletedGoal(userID, k).call({from: web3.eth.defaultAccount}, function(error, result){
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
      Nceno.methods.successPerGoal(userID, goals2[i]).call({from: web3.eth.defaultAccount}, function(error, result){
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
  quickStats();
}

var currentWeek = 0;
function selectedChallenge(){
    // Initialize Selectric and bind to 'change' event
  $('#goalCategories').selectric().on('change', function() {
    var goalid = web3.utils.padRight($('#goalCategories').val(),34);
    Nceno.methods.getGoalParams(goalid)
    .call({from: web3.eth.defaultAccount},
        function(error, result) {
        if (!error){
          //echo challenge
          var compcount = result[6];
          var tstamp = new Date(result[4]*1000);
          var buyin = Math.round(result[1]*result[5]/100000000000000000000);
          $("#echStake").html("$"+buyin);
          $("#echWks").html(result[3]+" wks");
          $("#echSes").html(result[2]+" x/wk");
          $("#echMins").html(result[0]+ " mins");
          $("#echComp").html(result[6]);
          $("#echStart").html(tstamp.toDateString());
          $("#dashboard").show();

          //set current challenge week globally
          currentWeek = Math.round((Date.now()/1000 - result[4])/604800);

          //leaderboard
          $("#rows").empty();
          Nceno.methods.getParticipants(goalid)
          .call({from: web3.eth.defaultAccount},
            function(error, result) {
              if (!error){
                var ids = new Array();
                var name = new Array();
                var flag = new Array();
                
                
                for (let j = 0; j < compcount; j++){
                  ids = result[0];
                  name = result[1];
                  flag = result[2];
                }

                
                for (let k = 0; k < compcount; k++){
                  Nceno.methods.getMyGoalStats1(ids[k], goalid)
                  .call({from: web3.eth.defaultAccount},
                    function(error, result) {
                      if (!error){
                        var adherence = new Array();
                        adherence[k] = result[0];

                        Nceno.methods.getMyGoalStats2(ids[k], goalid)
                        .call({from: web3.eth.defaultAccount},
                          function(error, result) {
                            if (!error){
                              var bonusTotal = new Array();
                              var totalPay = new Array();
                              var lostStake = new Array();

                              bonusTotal[k] = result[3];
                              totalPay[k] = result[4];
                              lostStake[k] = result[1];

                              var convertedName = web3.utils.hexToUtf8(name[k]);
                              var convertedFlag = web3.utils.hexToUtf8(flag[k]).toLowerCase();

                              //bug: values of k are not being hit. maybe something wrong with blockchain call latency?
                              $("#leaderboard").after(
                                '<tr id="player['+k+']"><td>'+ adherence[k]+'% </td><td>'+ convertedName +'</td><td><img src="https://ipdata.co/flags/'+convertedFlag+'.png"></td><td>$'+bonusTotal[k]+'</td><td>$'+totalPay[k]+'</td><td>$'+lostStake[k]+'</td></tr>'
                              );                        
                            }
                            else
                            console.error(error);
                        });
                      }
                      else
                      console.error(error);
                  });
                }
              }
              else
              console.error(error);
          });
        } 
        else
        console.error(error);
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

        $("#srStake").html("$"+buyin);
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
function browse(){
  $("#emptyThis").empty();
  //var goals1 = new Array();
  for (let i = 0; i < 20; i++){
    Nceno.methods.getFutureGoal(i).call({from: web3.eth.defaultAccount}, function(error, result){
      if(result[0] != 0x0000000000000000000000000000000000000000000000000000000000000000 && result[0] != undefined){
        //var goalid = result[0];

        //list it in the table
        var tstamp = new Date(result[5]*1000);
        var buyin = Math.round(result[2]/100000000000000000000);

        $("#startingSoon").after('<tr><td>$'+buyin+
          '</td><td>'+result[4]+
          ' wks</td><td>'+result[3]+
          ' x/wk</td><td>'+result[1]+
          ' min</td><td>'+result[6]+
          ' </td><td>'+tstamp.toDateString()+
          '</td><td><button type="button" onclick="setGoalID('+result[0]+')" id="soonJoin" class="btn btn-primary px-1 py-0 ml-0 mt-0" data-toggle="modal" data-target="#popupSoonJoin" data-whatever="@mdo">Join</button></td></tr>');
      }
    });    
  }

  /*for(let j = 0; j < 20; j++){
    var goalid = goals1[j];
    Nceno.methods.getGoalParams(goalid)
    .call({from: web3.eth.defaultAccount},
      function(error, result) {
      if (!error){
        
        //list it in the table
        var tstamp = new Date(result[4]*1000);
        var buyin = Math.round(result[1]*result[5]/100000000000000000000);

        $("#startingSoon").after('<tr><td>$'+buyin+
          '</td><td>'+result[3]+
          ' wks</td><td>'+result[2]+
          ' x/wk</td><td>'+result[0]+
          ' min</td><td>'+result[6]+
          ' </td><td>'+tstamp.toDateString()+
          '</td><td><button type="button" onclick="setGoalID('+goalid+')" id="soonJoin" class="btn btn-primary px-1 py-0 ml-0 mt-0" data-toggle="modal" data-target="#popupSoonJoin" data-whatever="@mdo">Join</button></td></tr>');
      }
      else
      console.error(error);
    });
  }*/ 
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
  Nceno.methods.claimBonus(
    goalid,
    userID
  )
  .send({from: web3.eth.defaultAccount, gas: 2000000, gasPrice: 15000000000},
    function(error, result) {
      if (!error){
        $("#claimBtn").hide();
        $("#claimLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).on('confirmation', function(confNumber, receipt){ 
    $("#claimLoader").hide();
    $("#claimSuccess").show();
    console.log("lost stake claim was successful!") })
    .on('error', function(error){console.log(error);});;
});

//button to log active minutes for a payout. Needs work. Could probably simplify the api get request..
$("#logBtn").click(function() {
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.fitbit.com/1/user/'+ fitbitUser +'/activities/heart/date/today/1d.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function() {
 if (xhr.status === 200) {
    
    var data = JSON.parse(xhr.responseText);
    var obj = [data];
    var fatBurn = obj[0]["activities-heart"][0].value.heartRateZones[1].minutes;
    var cardio = obj[0]["activities-heart"][0].value.heartRateZones[2].minutes;
    var peak = obj[0]["activities-heart"][0].value.heartRateZones[3].minutes;
    var formattedTime = Date.parse(obj[0]["activities-heart"][0].dateTime)/1000 - sign*pad;

    console.log(fitbitUser +"'s active minutes for "+ obj[0]["activities-heart"][0].dateTime);
    console.log(obj[0]["activities-heart"][0].value.heartRateZones[1].minutes);
    console.log(obj[0]["activities-heart"][0].value.heartRateZones[2].minutes);
    console.log(obj[0]["activities-heart"][0].value.heartRateZones[3].minutes);
    console.log("time stamp: "+formattedTime);

    var sessionMins = fatBurn + cardio + peak;
    //var sessionMins = 32; //debug only
    console.log("total session minutes to be logged: "+sessionMins);
  
    Nceno.methods.simplePayout(userID, sessionMins, formattedTime+2, web3.utils.padRight($("#goalCategories").val(),34)).send(
      {from: web3.eth.defaultAccount, gas: 3000000, gasPrice: 15000000000},
        function(error, result) {
          if (!error){
            $("#logBtn").hide();
            $("#logLoader").show();
            console.log(result);
          }
          else
          console.error(error);
        }).on('confirmation', function(confNumber, receipt){ 
          $("#logLoader").hide();
          $("#logSuccess").show();
          console.log("activity minutes logged successfully!") })
    .on('error', function(error){console.log(error);});;
  }
  };
  xhr.send();
});//close click(function(){

//gets the current price of ETH in USD. Should be called as close as possible to goal deployment.
function updateEthPrice() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var resp = JSON.parse(xhr.responseText);
      //var obj = [resp];
      ethPrice = resp.USD;
      console.log(this.responseText);
      console.log(ethPrice);
    }
  });
  xhr.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
  xhr.send();
}

//not sure if using window.onload correctly... but,
//this initializes a bunch of stuff as soon as the user navigates to the app page.
window.onload = function() {
  //charts
  var ctx1 = document.getElementById('canvas1').getContext('2d');
  window.myLine1 = new Chart(ctx1, config1);

  var ctx2 = document.getElementById('canvas2').getContext('2d');
  window.myLine2 = new Chart(ctx2, config2);

  var ctx3 = document.getElementById('canvas3').getContext('2d');
  window.myLine3 = new Chart(ctx3, config3);

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
    min: 10,
    max: 300,
    step: 1,
    value: 55,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal4"
  });

  //delays extraction of the fitbit creds until the user has authed.
  if (window.location.href != 'https://www.nceno.app/app.html'){
    //call fitbit api with user creds
    //getting the access token from url
    access_token = window.location.href.split('#')[1].split('=')[1].split('&')[0];
    // get the userID
    fitbitUser = window.location.href.split('#')[1].split('=')[2].split('&')[0];
    userID = web3.utils.padRight(web3.utils.toHex(fitbitUser),34);
    //log them
    console.log(access_token);
    console.log(fitbitUser);

    $("#fitbitBtn").hide();
    $("#fitbitSuccess").html("Wearable ID: "+fitbitUser);
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
var pad;
var sign;
var flag;
$.getJSON("https://api.ipdata.co/?api-key=test", function(data) {
  var countryName = data.country_name;
  var timezone = data.time_zone.offset;
  flag = data.country_code;
  //console.log("Country Name: " + countryName);
  //console.log("Time Zone: " + timezone);
  sign = parseInt(timezone.slice(0, 1)+1);
  pad = parseInt(timezone.slice(1, 3)*60*60 + timezone.slice(3, 5)*60)
  //pad = parseInt(timezone.slice(0, 1)+1)
  //console.log(pad);
  //console.log("Flag URL: " + flag);
});             