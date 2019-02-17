var Nceno = new web3.eth.Contract([
    {
      "constant": true,
      "inputs": [
        {
          "name": "_goalID",
          "type": "bytes32"
        }
      ],
      "name": "getPotentialPayout",
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
        },
        {
          "name": "_flag",
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
          "name": "flag",
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
          "name": "_userID",
          "type": "bytes32"
        },
        {
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getCompletedGoal",
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
          "type": "uint256[12]"
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
      "name": "getUpcomingGoal",
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
          "name": "_flag",
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
    }
  ], '0xc9AcFCDC51558Ce90167158a1087D11AE1821439');