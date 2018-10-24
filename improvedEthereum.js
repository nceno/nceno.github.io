//<script>
        var Web3 = require('web3');
        //web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545")); //for local testnet
        web3 = new Web3(web3.currentProvider); //for cipher, status, or metamask
        //web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9db967faa260482782c435096a818865")); //for key handler  

        web3.eth.defaultAccount = web3.eth.accounts[0];

        var GoalFactoryContract = web3.eth.contract([
  {
    "constant": true,
    "inputs": [
      {
        "name": "_fbID",
        "type": "uint256"
      }
    ],
    "name": "getLastGoalByFitbitID",
    "outputs": [
      {
        "name": "",
        "type": "address"
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
        "name": "_name",
        "type": "bytes16"
      },
      {
        "name": "_email",
        "type": "bytes16"
      },
      {
        "name": "_fitbitID",
        "type": "uint256"
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
        "name": "_roundLength",
        "type": "uint256"
      },
      {
        "name": "_beginAt",
        "type": "bytes16"
      },
      {
        "name": "_endAt",
        "type": "bytes16"
      },
      {
        "name": "_stake",
        "type": "uint256"
      }
    ],
    "name": "createGoal",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
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
        "type": "uint256"
      }
    ],
    "name": "getGoalsByFitbitID",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllGoals",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
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
        "name": "name",
        "type": "bytes16"
      },
      {
        "indexed": false,
        "name": "email",
        "type": "bytes16"
      },
      {
        "indexed": false,
        "name": "fitbitID",
        "type": "uint256"
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
        "name": "roundLength",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "beginAt",
        "type": "bytes16"
      },
      {
        "indexed": false,
        "name": "endAt",
        "type": "bytes16"
      },
      {
        "indexed": false,
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "goalInfo",
    "type": "event"
  }
]);
        var PocGoalContract = web3.eth.contract([
  {
    "constant": false,
    "inputs": [],
    "name": "depositStake",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "loseStake",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "winStake",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getGoal",
    "outputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "bytes16"
      },
      {
        "name": "",
        "type": "bytes16"
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
        "type": "bytes16"
      },
      {
        "name": "",
        "type": "bytes16"
      },
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
    "inputs": [
      {
        "name": "_goalOwner",
        "type": "address"
      },
      {
        "name": "_name",
        "type": "bytes16"
      },
      {
        "name": "_email",
        "type": "bytes16"
      },
      {
        "name": "_fitbitID",
        "type": "uint256"
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
        "name": "_roundLength",
        "type": "uint256"
      },
      {
        "name": "_beginAt",
        "type": "bytes16"
      },
      {
        "name": "_endAt",
        "type": "bytes16"
      },
      {
        "name": "_stake",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "depositSent",
    "type": "event"
  }
]);

        var GoalFactory = GoalFactoryContract.at('0x275f6e15bca3c9fa6af5a26b79ccd4d6b711ee63'); //ropsten testnet
        console.log(GoalFactory);
        $("#depositStakeBtn").hide();
        
        //event listener for goal creation
        var goalInfoEvent = GoalFactory.goalInfo({},'latest');
        goalInfoEvent.watch(function(error, result){
            if (result)
                {
                    if (result.blockHash != $("#insTrans").html()) 
                      $("#loader").hide();
                      $("#depositStakeBtn").show();
                      $("#createGoalBtn").hide();
                      $("#insTrans").html('Block hash: ' +result.blockHash);
                      $("#goalDisplay").html(web3.toAscii(result.args.name) + ' ' + result.args.fitbitID + ' '+ result.args.stake);
                      console.log(result.blockHash);
                      GoalFactory.getLastGoalByFitbitID(
            $("#fitbitID").val(),
            function(error, result) {
              if (!error){
                var PocGoal = PocGoalContract.at(result);
                
                
                var usdStake = ($("#stake").val()-1.00)*0.0048;
                PocGoal.depositStake(
                  {from: web3.eth.accounts[0], gas: 30000, value: web3.toWei(usdStake, "ether"), gasPrice: 10000000000},
                    function(error, result2) {
                      if (!error){
                        console.log(result2);
                      }//close if
                      else
                        console.error(error);
                    }//closes callback
                )//closes contract function call

              }//close if
              else
                console.error(error);
            }//closes callback
          )//closes GoalFactory contract function call



                } else {
                    $("#loader").hide();
                    console.log(error);
                }
        });
       
    
        //creating the goal
        $("#createGoalBtn").click(function() {
            $("#loader").show();
            $("#depositStakeBtn").hide();
            GoalFactory.createGoal(
                $("#name").val(), $("#email").val(), $("#fitbitID").val(), $("#activeMinutes").val(), 
                $("#rounds").val(), $("#roundLength").val(), $("#beginAt").val(), $("#endAt").val(), $("#stake").val(), {gas: 500000, gasPrice: 10000000000},
                function(error, result) {
                    if (!error){
                      console.log(result);
                    }
                    else
                      console.error(error);
                })
        });
                
        
        
        //get address of the goal just created and deposit stake
        $("#depositStakeBtn").click(function() {
          //$("#loader").show();
          GoalFactory.getLastGoalByFitbitID(
            $("#fitbitID").val(),
            function(error, result) {
              if (!error){
                var PocGoal = PocGoalContract.at(result);
                
                
                var usdStake = ($("#stake").val()-1.00)*0.0048;
                PocGoal.depositStake(
                  {from: web3.eth.accounts[0], gas: 30000, value: web3.toWei(usdStake, "ether"), gasPrice: 10000000000},
                    function(error, result2) {
                      if (!error){
                        console.log(result2);
                      }//close if
                      else
                        console.error(error);
                    }//closes callback
                )//closes contract function call

              }//close if
              else
                console.error(error);
            }//closes callback
          )//closes GoalFactory contract function call 
        });//closes function(){ and click(
        //end of function call by button click



    //</script>
