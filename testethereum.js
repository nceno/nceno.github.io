//<script>
         ///////////////call fitbit api with user creds
//getting the access token from url
var access_token = window.location.href.split('#')[1].split('=')[1].split('&')[0];

// get the userid
var userId = window.location.href.split('#')[1].split('=')[2].split('&')[0];

console.log(access_token);
console.log(userId);

        var Web3 = require('web3');
        //web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545")); //local testnet
        web3 = new Web3(web3.currentProvider); //for cipher, status, or metamask
        //web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9db967faa260482782c435096a818865")); //rinkeby 
        //web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/9db967faa260482782c435096a818865")); //mainnet
         
        web3.eth.defaultAccount = web3.eth.accounts[0];

        var GoalFactoryContract = web3.eth.contract([
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "bytes32"
      },
      {
        "name": "_email",
        "type": "bytes32"
      },
      {
        "name": "_fitbitID",
        "type": "string"
      },
      {
        "name": "_activeMinutes",
        "type": "uint256"
      },
      {
        "name": "_rounds",
        "type": "uint256"
      },
      {
        "name": "_beginAt",
        "type": "bytes32"
      },
      {
        "name": "_stake",
        "type": "uint256"
      }
    ],
    "name": "createGoal",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "ncenoTotalWithdrawal",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "withdrawal",
        "type": "uint256"
      }
    ],
    "name": "ncenoWithdrawal",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "userID",
        "type": "string"
      },
      {
        "name": "reportedMins",
        "type": "uint256"
      },
      {
        "name": "timeStamp",
        "type": "uint256"
      }
    ],
    "name": "settleLog",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "userAddress",
        "type": "address"
      },
      {
        "name": "payout",
        "type": "uint256"
      }
    ],
    "name": "userPayout",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "name",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "email",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "fitbitID",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "activeMinutes",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "rounds",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "beginAt",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "stake",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "timeCreated",
        "type": "uint256"
      }
    ],
    "name": "goalInfo",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllGoals",
    "outputs": [
      {
        "components": [
          {
            "name": "owner",
            "type": "address"
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
            "name": "fitbitID",
            "type": "string"
          },
          {
            "name": "activeMinutes",
            "type": "uint256"
          },
          {
            "name": "rounds",
            "type": "uint256"
          },
          {
            "name": "beginAt",
            "type": "bytes32"
          },
          {
            "name": "stake",
            "type": "uint256"
          },
          {
            "name": "sucPayouts",
            "type": "uint256"
          },
          {
            "name": "totalPaidOut",
            "type": "uint256"
          },
          {
            "name": "timeCreated",
            "type": "uint256"
          }
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getGoalCount",
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
        "name": "_fbID",
        "type": "string"
      }
    ],
    "name": "getGoalsByFitbitID",
    "outputs": [
      {
        "components": [
          {
            "name": "owner",
            "type": "address"
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
            "name": "fitbitID",
            "type": "string"
          },
          {
            "name": "activeMinutes",
            "type": "uint256"
          },
          {
            "name": "rounds",
            "type": "uint256"
          },
          {
            "name": "beginAt",
            "type": "bytes32"
          },
          {
            "name": "stake",
            "type": "uint256"
          },
          {
            "name": "sucPayouts",
            "type": "uint256"
          },
          {
            "name": "totalPaidOut",
            "type": "uint256"
          },
          {
            "name": "timeCreated",
            "type": "uint256"
          }
        ],
        "name": "",
        "type": "tuple[]"
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
        "name": "_fbID",
        "type": "string"
      }
    ],
    "name": "getLastGoalByFitbitID",
    "outputs": [
      {
        "components": [
          {
            "name": "owner",
            "type": "address"
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
            "name": "fitbitID",
            "type": "string"
          },
          {
            "name": "activeMinutes",
            "type": "uint256"
          },
          {
            "name": "rounds",
            "type": "uint256"
          },
          {
            "name": "beginAt",
            "type": "bytes32"
          },
          {
            "name": "stake",
            "type": "uint256"
          },
          {
            "name": "sucPayouts",
            "type": "uint256"
          },
          {
            "name": "totalPaidOut",
            "type": "uint256"
          },
          {
            "name": "timeCreated",
            "type": "uint256"
          }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]);

        //var GoalFactory = GoalFactoryContract.at('0x40f86e52e25582ff031b5ae04007301042b77298'); //mainnet from metamask account 2
        var GoalFactory = GoalFactoryContract.at('0x22b51c7a64510780dad13fb2cd1c868476060447'); //rinkeby from metamask account 2
        
        console.log(GoalFactory);
        $("#allSet").hide();
        $("#yourGoal").hide();
        $("#createGoalBtn").hide();
        
        //show create button only if user agrees to terms
        $("#checker").on('click', function() {
          if($("#checker").is(':checked')) {
            $("#createGoalBtn").show();
            
          } else {
            $("#createGoalBtn").hide();
            
          }
        });


        //event listener for goal creation
        var goalInfoEvent = GoalFactory.goalInfo({},'latest');
        
        goalInfoEvent.watch(function(error, result){
            if (result)
                {
                    if (result.blockHash != $("#insTrans").html()) //when the creation txn is mined, and goal spawned
                      console.log(result.blockHash);
                      //loader hide
                      $("#loader").hide();
                      //echo goal creation
                      $("#goalDisplay").html(web3.toAscii(result.args.name) + ' just made a goal!');

                      //show data
                      $("#yourGoal").show();
                      //echo goal data
                      $("#yourGoal").html(web3.toAscii(result.args.name)+' at '+web3.toAscii(result.args.email)+ 
                        ' just committed to doing '+ result.args.rounds+ ' x '+ result.args.activeMinutes+ 
                        ' minute exercise sessions each week for 4 weeks, beginning from '+ web3.toAscii(result.args.beginAt)+ 
                        ', with a stake of $'+ result.args.stake+' USD!');
                      //link to log workouts
                      $("#allSet").show();
                    } else {
                    $("#loader").hide();
                    console.log(error);
                }
        });
       
    
        //creating the goal
        $("#createGoalBtn").click(function() {
            var usdStake = ($("#stake").val()-1.05)*0.0047;
            GoalFactory.createGoal(
                $("#name").val(), 
                $("#email").val(), 
                ('1'+$("#fitbitID").val()), 
                $("#activeMinutes").val(), 
                $("#rounds").val(), 
                ('Beginning/ '+$("#beginAt").val()), 
                $("#stake").val(),
                {from: web3.eth.accounts[0], gas: 400000, gasPrice: 12000000000, value: web3.toWei(usdStake, "ether")},
                function(error, result) {
                    if (!error){
                      $("#createGoalBtn").hide();
                      $("#loader").show();
                      $("#insTrans").html(result.blockHash);
                      console.log(result);
                    }
                      else
                      console.error(error);
                })
        });
                
        
        
 

$("#logBtn").click(function() {
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/heart/date/today/1d.json');
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

      console.log(userId +"'s active minutes for "+ obj[0]["activities-heart"][0].dateTime);
    console.log(obj[0]["activities-heart"][0].value.heartRateZones[1].minutes);
    console.log(obj[0]["activities-heart"][0].value.heartRateZones[2].minutes);
    console.log(obj[0]["activities-heart"][0].value.heartRateZones[3].minutes);
    console.log("time stamp: "+formattedTime);

    var sessionMins = fatBurn + cardio + peak;
    console.log("total session minutes to be logged: "+sessionMins);

    
    GoalFactory.settleLog(
                userId, 
                sessionMins,
                formattedTime,
                {from: web3.eth.accounts[0], gas: 60000, gasPrice: 12000000000},
                function(error, result) {
                    if (!error){
                      //echo the result and do some jquery loader stuff
                    }
                      else
                      console.error(error);
                })//close contract function call
    
    
   }
};
xhr.send()
});//close click(function(){


    //</script>
