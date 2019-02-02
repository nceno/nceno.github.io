/*<!--app logic -->
<script>*/

$('[data-toggle="datepicker"]').datepicker({'autoHide': true});
$("#time").click(function(){
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  console.log(time);
})

//web3 definition would go here ----->>

function showPortis() {
  // will only open the portis menu
  web3.currentProvider.showPortis(() => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      console.log("default: " + web3.eth.defaultAccount);
    });
  })
}

//ABI would go here ----->>

console.log(Nceno);
$("#createBtn").hide();
//show create button only if user agrees to terms
$("#checker").on('click', function() {
if($("#checker").is(':checked')) {
  $("#createBtn").show();
  
} else {
  $("#createBtn").hide();
  
}
});

//call fitbit api with user creds
//getting the access token from url
var access_token = window.location.href.split('#')[1].split('=')[1].split('&')[0];
// get the userID
var fitbitUser = window.location.href.split('#')[1].split('=')[2].split('&')[0];
var userID = web3.utils.padRight(web3.utils.toHex(fitbitUser),34);
//log them
console.log(access_token);
console.log(fitbitUser);
              
//creating a competitor account
$("#makeAcctBtn").click(function() {
  Nceno.methods.createCompetitor(
    userID,
    web3.utils.padRight(web3.utils.toHex($("#wearable").val()),34),
    web3.utils.padRight(web3.utils.toHex($("#name").val()),34),
    web3.utils.padRight(web3.utils.toHex($("#email").val()),34)
  )
  .send({from: web3.eth.defaultAccount, gas: 200000, gasPrice: 15000000000},
    function(error, result) {
      if (!error){
        $("#makeAcctBtn").hide();
        console.log(result);
      }
      else
      console.error(error);
    }
  );
}); 

//creating a goal
var goalID = web3.utils.randomHex(5);
$("#hostBtn").click(function() {
  updateEthPrice();
  var msgValueHost = Math.floor($("#stakeDD").val()*1000000000000000000/ethPrice);
  var usdStakeInWei = msgValueHost.toString();
  
  var start = moment.unix($("#datetimepicker1").datetimepicker('date'));
  var trimmed = Math.floor(new Date(start).getTime()/1000000);
  console.log(usdStakeInWei, start, trimmed);
  //function call:
  Nceno.methods.createGoal(
    goalID,
    $("#activeMinsDD").val(),
    usdStakeInWei,
    $("#sesPerWkDD").val(),
    $("#wksDD").val(),
    trimmed,
    userID
  )
  .send({from: web3.eth.defaultAccount, gas: 2000000, gasPrice: 15000000000, value: msgValueHost},
    function(error, result) {
      if (!error){
        $("#hostBtn").hide();
        $("#cancelBtn").hide();
        console.log(result);
      }
      else
      console.error(error);
    }
  );
});

var ethPrice;
function echoGoal(){
  //get live eth price
  updateEthPrice();
  //echo modal
  $("#host").tab('show');
  $('#popupCreate').modal('show');        
  $("#goalEcho").html("You're commiting $" + $("#stakeDD").val() + " to working out for " + 
  $("#activeMinsDD").val() +"mins " + $("#sesPerWkDD").val()+" times per week for "+ $("#wksDD").val()+
  " weeks, starting automatically at "+ $("#datetimepicker1").data('date') +". The challenge ID is: "+ goalID+".");
}

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

var populated = false;
function makeList(){
  //makes a list of active goals for a user
  if(populated === false){
    $("#chIDtools").selectric(); 
    var i = 0;
    var goals = new Array();
    for (i = 0; i < 15; i++){
      Nceno.methods.getActiveGoal(userID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        if(result != undefined){
          goals[i] = result;
          console.log(goals[i]);
          $("#chIDtools").append('<option>'+ goals[i].slice(0, 12) +'</option>');
          $('#chIDtools').selectric('refresh');
        }
      });    
    }
    populated = true;
  }
}


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
        console.log(result);
      }
      else
      console.error(error);
    }
  );
});

$("#logBtn").click(function() {
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.fitbit.com/1/user/'+ fitbitUser +'/activities/heart/date/today/1d.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function() {
 if (xhr.status === 200) {
    //console.log(xhr.responseText);
    //document.write(xhr.responseText);
    
    var data = JSON.parse(xhr.responseText);
    var obj = [data];
    var fatBurn = obj[0]["activities-heart"][0].value.heartRateZones[1].minutes;
    var cardio = obj[0]["activities-heart"][0].value.heartRateZones[2].minutes;
    var peak = obj[0]["activities-heart"][0].value.heartRateZones[3].minutes;
    var formattedTime = Date.parse(obj[0]["activities-heart"][0].dateTime)/1000;

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
            console.log(result);
          }
          else
          console.error(error);
        });
  }
  };
  xhr.send()
});//close click(function(){

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


window.onload = function() {
  var ctx1 = document.getElementById('canvas1').getContext('2d');
  window.myLine1 = new Chart(ctx1, config1);

  var ctx2 = document.getElementById('canvas2').getContext('2d');
  window.myLine2 = new Chart(ctx2, config2);

  var ctx3 = document.getElementById('canvas3').getContext('2d');
  window.myLine3 = new Chart(ctx3, config3);

  $("#slider").roundSlider();
};
//</script>
// end chart3




$.getJSON("https://api.ipdata.co/?api-key=test", function(data) {
  var countryName = data.country_name;
  var timezone = data.time_zone.offset;
  var flag = data.country_code;
  console.log("Country Name: " + countryName);
  console.log("Time Zone: " + timezone);
  console.log("Flag URL: " + flag);
});             



/*</script>
<!-- / app logic -->*/