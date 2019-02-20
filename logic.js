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
      $("#portisSuccess").html("Your address: "+web3.eth.defaultAccount.slice(0, 22)+" "+web3.eth.defaultAccount.slice(23, 42));
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
$("#logLoader").hide();
$("#logSuccess").hide();
$("#claimLoader").hide();
$("#claimSuccess").hide();
$("fitbitSuccess").hide();
$("portisSuccess").hide();

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
    console.log("account creation successful!");
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
    console.log("challenge creation successful!"); })
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

//needs work
function echoJoinedGoal(){
  updateEthPrice();
  var goalid = web3.utils.padRight($("#col[i]").val(),34)
  Nceno.methods.getGoalParams(
    goalid
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        var tstamp = new Date(result[4]*1000);
        $("#echoSelectedGoal").html(
          "Details for challenge "+ goalid.slice(0, 12) +
          ": You commited $" + 
          Math.floor(result[1]*ethPrice/1000000000000000000) + 
          " to working out for " + 
          result[0] +
          "mins " + 
          result[2] +
          " times per week for "+ 
          result[3] +
          " weeks, starting automatically at "+ 
          tstamp + 
          "."
        );
        console.log(result);
      }
      else
      console.error(error);
    }
  );
}

//an abortion of a function that should populate the dropdown with upcoming, active, and completed goals. Needs work.
var populated = false;
function makeList(){
  if(populated === false){
    $("#goalCategories").selectric();
 
    var i = 0;
    var j = 0;
    var k = 0;
    var goals1 = new Array();
    var goals2 = new Array();
    var goals3 = new Array();

    for (i = 0; i < 15; i++){
      Nceno.methods.getUpcomingGoal(userID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals1[i] = result;
          console.log(goals1[i]);
          $("#goalCategories").after('<option>'+ goals1[i].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });    
    }

    for (j = 0; j < 15; j++){
      Nceno.methods.getActiveGoal(userID, j).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals2[j] = result;
          console.log(goals2[j]);
          $("#activeGoals").after('<option>'+ goals2[j].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });    
    }

    for (k = 0; k < 15; k++){
      Nceno.methods.getCompletedGoal(userID, k).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != 0x0000000000000000000000000000000000000000000000000000000000000000 && result != undefined){
          goals3[k] = result;
          console.log(goals3[k]);
          $("#completedGoals").after('<option>'+ goals3[k].slice(0, 8) +'</option>');
          $('#goalCategories').selectric('refresh');
        }
      });    
    }
    populated = true;
  }
}

//helper function that populates the manage page with all the goodies. needs work.
function makePage(){
  makeList();
  selectedChallenge();
  //makeLeaderboard();
}

function selectedChallenge(){
    // Initialize Selectric and bind to 'change' event
  $('#goalCategories').selectric().on('change', function() {
    console.log("changed!");
    //$("#echo").text($('#goalCategories').val());
    var goalid = web3.utils.padRight($('#goalCategories').val(),34)
    Nceno.methods.getGoalParams(goalid)
    .call({from: web3.eth.defaultAccount},
        function(error, result) {
        if (!error){
          //echo challenge
          var tstamp = new Date(result[4]*1000);
          var buyin = result[1]*result[5]/10000000000000000;
          $("#echStake").html("$"+buyin);
          $("#echWks").html(result[3]+" wks");
          $("#echSes").html(result[2]+"x/wk");
          $("#echMins").html(result[0]+ "mins");
          $("#echComp").html(result[6]);
          $("#echStart").html(tstamp);
        }
        else
        console.error(error);
    });
  });
}

//working on it... alter contract to only intake buy-in and eth price.
function makeLeaderboard(){
    // Initialize Selectric and bind to 'change' event
  $('#goalCategories').selectric().on('change', function() {
    var goalid = web3.utils.padRight($('#goalCategories').val(),34)
    
    Nceno.methods.getGoalParams(goalid)
    .call({from: web3.eth.defaultAccount},
        function(error, result) {
        if (!error){
            //echo challenge
            var tstamp = new Date(result[4]*1000);
            $("#echStake").html(Math.floor(result[1]*ethPrice/1000000000000000000));
            $("#echWks").html(result[3]);
            $("#echSes").html(result[2]);
            $("#echMins").html(result[0]);
            $("#echComp").html(result[6]);
            $("#echStart").html(tstamp);

            //week by week breakdown


            //charts and stats


            //leaderboard
        }
        else
        console.error(error);
    });
  });
}

// needs work... not even sure.
function echoSelectedGoal(){
  updateEthPrice();
  var goalid = web3.utils.padRight($("#chIDtools").val(),34)
  Nceno.methods.getGoalParams(goalid)
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        var tstamp = new Date(result[4]*1000);
        $("#echoSelectedGoal").html(
          "Details for challenge "+ goalid.slice(0, 12) +
          ": You commited $" + 
          Math.floor(result[1]*ethPrice/1000000000000000000) + 
          " to working out for " + 
          result[0] +
          "mins " + 
          result[2] +
          " times per week for "+ 
          result[3] +
          " weeks, starting automatically at "+ 
          tstamp + 
          "."
        );
        console.log(result);
      }
      else
      console.error(error);
    }
  );
}



//button to claim lost stake from previous week. needs work.
$("#claimBtn").click(function() {
  var goalid = web3.utils.padRight($("#chIDtools").val(),34);
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
  
    Nceno.methods.simplePayout(userID, sessionMins, formattedTime+2, web3.utils.padRight($("#chIDtools").val(),34)).send(
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
  xhr.send()
});//close click(function(){


//old code to get live eth price that was killed by a cors violation.
/*function updateEthPrice() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var resp = JSON.parse(xhr.responseText);
      //var obj = [resp];
      ethPrice = resp[0].price_usd;
      console.log(this.responseText);
      console.log(ethPrice);
    }
  });
  xhr.open("GET", "https://cors-escape.herokuapp.com/https://api.coinmarketcap.com/v1/ticker/ethereum/");

  xhr.send();
}*/

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
    $("#fitbitSuccess").html("Your device ID: "+ fitbitUser);
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