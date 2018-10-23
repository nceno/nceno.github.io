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
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_email",
        "type": "string"
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
        "type": "string"
      },
      {
        "name": "_endAt",
        "type": "string"
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
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
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
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
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
        "type": "string"
      },
      {
        "name": "_email",
        "type": "string"
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
        "type": "string"
      },
      {
        "name": "_endAt",
        "type": "string"
      },
      {
        "name": "_stake",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
]);

        var GoalFactory = GoalFactoryContract.at('0xb9f93fa46be29fdd77ca2b9deb4063a97925bc04');
        console.log(GoalFactory);

        //var PocGoal = PocGoalContract.at('0xE4a9F35A85644ce480743Dc5ab9512820dBA27B3');
        //console.log(PocGoal);

        //creating the goal
        $("#createGoalBtn").click(function() {

            GoalFactory.createGoal(
                $("#name").val(), $("#email").val(), $("#fitbitID").val(), $("#activeMinutes").val(), $("#rounds").val(), $("#roundLength").val(), $("#beginAt").val(), $("#endAt").val(), $("#stake").val(), {gasPrice: 10000000000},
                function(error, result) {
                    if (!error){
                      //store fitbitID
                      //var fitbitID = $("#fitbitID").val();
                      console.log(result);
                    }
                    else
                      console.error(error);
                })
        });
                
        //get address of the goal just created
        $("#depositStakeBtn").click(function() {
          GoalFactory.getLastGoalByFitbitID(
            $("#fitbitID").val(),
            function(error, result) {
              if (!error){
                var PocGoal = PocGoalContract.at(result);

                var usdStake = ($("#stake").val()-2.50)*0.0048;
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
          )//closes contract function call
        });//closes function(){ and click(
        //end of function call by button click

    //</script>