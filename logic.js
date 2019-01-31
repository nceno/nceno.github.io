/*<!--app logic -->
<script>*/

$('[data-toggle="datepicker"]').datepicker({'autoHide': true});
$("#time").click(function(){
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  console.log(time);
})

//$("#loader").hide();
var PortisProvider = window.Portis.PortisProvider;
// Check if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(web3.currentProvider);
} else {
    // Fallback - use Portis
    web3 = new Web3(new PortisProvider({
      apiKey: "332bfe3ea28174fa515d478e23a1b31c",
      network: 'rinkeby'
    }));
}

function showPortis() {
  // will only open the portis menu
  web3.currentProvider.showPortis(() => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      console.log("default: " + web3.eth.defaultAccount);
    });
  })
}

var Nceno = new web3.eth.Contract([
        {
          "constant": false,
          "inputs": [
            {
              "name": "_goalID",
              "type": "bytes32"
            },
            {
              "name": "_activeMins",
              "type": "uint256"
            },
            {
              "name": "_stakeWEI",
              "type": "uint256"
            },
            {
              "name": "_sesPerWk",
              "type": "uint256"
            },
            {
              "name": "_wks",
              "type": "uint256"
            },
            {
              "name": "_startTime",
              "type": "uint256"
            },
            {
              "name": "_userID",
              "type": "bytes32"
            }
          ],
          "name": "createGoal",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "profileOf",
          "outputs": [
            {
              "name": "userID",
              "type": "bytes32"
            },
            {
              "name": "wearableModel",
              "type": "bytes32"
            },
            {
              "name": "name",
              "type": "bytes32"
            },
            {
              "name": "email",
              "type": "bytes32"
            },
            {
              "name": "walletAdr",
              "type": "address"
            },
            {
              "name": "goalTotal",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_index",
              "type": "uint256"
            }
          ],
          "name": "getFutureGoal",
          "outputs": [
            {
              "name": "",
              "type": "bytes32"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "bytes32[10]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "activeCashout",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "getSingleRev",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getPastRev",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "ncenoEmergencyCashout",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "name": "_reportedMins",
              "type": "uint256"
            },
            {
              "name": "_timeStamp",
              "type": "uint256"
            },
            {
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "simplePayout",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getActiveRev",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "getMyGoalStats2",
          "outputs": [
            {
              "name": "",
              "type": "uint256[12]"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256[12]"
            },
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "getLeaderBoard",
          "outputs": [
            {
              "name": "",
              "type": "bytes32[10]"
            },
            {
              "name": "",
              "type": "uint256[12][10]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "name": "_wearableModel",
              "type": "bytes32"
            },
            {
              "name": "_name",
              "type": "bytes32"
            },
            {
              "name": "_email",
              "type": "bytes32"
            }
          ],
          "name": "createCompetitor",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_newChoices",
              "type": "uint256[12][6][2]"
            }
          ],
          "name": "setPartitionChoices",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "name": "_index",
              "type": "uint256"
            }
          ],
          "name": "getActiveGoal",
          "outputs": [
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "userExists",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "pastCashout",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_goalID",
              "type": "bytes32"
            },
            {
              "name": "_userID",
              "type": "bytes32"
            }
          ],
          "name": "claimBonus",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_goalID",
              "type": "bytes32"
            },
            {
              "name": "_userID",
              "type": "bytes32"
            }
          ],
          "name": "joinGoal",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "goalCount",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "getMyGoalStats1",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "singleCashout",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "getGoalParams",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "bytes32[10]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_eventName",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_wearableModel",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_name",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_email",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_walletAdr",
              "type": "address"
            }
          ],
          "name": "ProfileCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_eventName",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_goalID",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_activeMins",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_stakeWEI",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_sesPerWk",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_wks",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_startTime",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_userID",
              "type": "bytes32"
            }
          ],
          "name": "GoalCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_eventName",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_goalID",
              "type": "bytes32"
            }
          ],
          "name": "CompetitorJoined",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_eventName",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_goalID",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_wk",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_payout",
              "type": "uint256"
            }
          ],
          "name": "PayoutRedeemedBy",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_eventName",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_userID",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_goalID",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "_amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_wk",
              "type": "uint256"
            }
          ],
          "name": "BonusClaimedBy",
          "type": "event"
        }], '0xed2bcfbe945ae7de0eb480510ff7290b223929ae');

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

//$( document ).ready(function() {console.log("refreshed");});
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

//chart1
//<script>
var config = {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
        datasets: [{
          label: 'Locked stake %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#ccff00',
          borderColor: '#ccff00',
          fill: false,
          borderDash: [5, 5],
          pointRadius: [2, 5, 7, 5, 9, 15, 10, 3, 8, 18, 11, 7],
        },{
          label: 'Competitor success rate %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#f442b3',
          borderColor: '#f442b3',
          fill: false,
          pointHitRadius: 20,
        }]
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
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        },
        title: {
          display: true,
          text: 'Weekly payouts'
        }
        gridlines:{
          display: true,
          color: '#494949'
        }
      }
    };
window.onload = function() {
  var ctx = document.getElementById('canvas').getContext('2d');
  window.myLine = new Chart(ctx, config);
};
//</script>
// end chart1
             
/*</script>
<!-- / app logic -->*/