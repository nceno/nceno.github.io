//initialize portis
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'ropsten', { gasRelay: true, scope: ['email'] });
const web3 = new Web3(portis.provider);

var Nceno = new web3.eth.Contract([
  {
    "constant": true,
    "inputs": [
      {
        "name": "origSender",
        "type": "address"
      },
      {
        "name": "msgData",
        "type": "bytes"
      }
    ],
    "name": "getSenderFromData",
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
        "name": "_newChoices",
        "type": "uint256[12][6]"
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
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getFutureGoal",
    "outputs": [
      {
        "name": "",
        "type": "bytes"
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
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      }
    ],
    "name": "claim",
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
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      }
    ],
    "name": "join",
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
        "type": "uint256"
      }
    ],
    "name": "profileOf",
    "outputs": [
      {
        "name": "stravaID",
        "type": "uint256"
      },
      {
        "name": "userName",
        "type": "bytes"
      },
      {
        "name": "walletAdr",
        "type": "address"
      },
      {
        "name": "email",
        "type": "bytes"
      },
      {
        "name": "born",
        "type": "uint256"
      },
      {
        "name": "flag",
        "type": "bytes"
      },
      {
        "name": "OS",
        "type": "uint256"
      },
      {
        "name": "myGoalCount",
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
        "name": "_newThresh",
        "type": "uint256"
      }
    ],
    "name": "setHRthresh",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "payee",
        "type": "address"
      }
    ],
    "name": "_withdrawDeposits",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_stravaID",
        "type": "uint256"
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
        "type": "bytes"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAppStatus",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      },
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
    "inputs": [
      {
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "setNcenoAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getSender",
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
        "name": "token",
        "type": "address"
      },
      {
        "name": "destAddress",
        "type": "address"
      }
    ],
    "name": "execSwap",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_goalID",
        "type": "bytes"
      }
    ],
    "name": "getParticipants",
    "outputs": [
      {
        "name": "",
        "type": "uint256[10]"
      },
      {
        "name": "",
        "type": "bytes[10]"
      },
      {
        "name": "",
        "type": "bytes[10]"
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
        "name": "",
        "type": "uint256"
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
    "constant": true,
    "inputs": [],
    "name": "getHubAddr",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "goalIDs",
    "outputs": [
      {
        "name": "",
        "type": "bytes"
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
        "name": "context",
        "type": "bytes"
      }
    ],
    "name": "preRelayedCall",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_instance",
        "type": "uint256"
      }
    ],
    "name": "getMyGoalInstance",
    "outputs": [
      {
        "name": "",
        "type": "bytes"
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
        "name": "relay",
        "type": "address"
      },
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "encodedFunction",
        "type": "bytes"
      },
      {
        "name": "transactionFee",
        "type": "uint256"
      },
      {
        "name": "gasPrice",
        "type": "uint256"
      },
      {
        "name": "gasLimit",
        "type": "uint256"
      },
      {
        "name": "nonce",
        "type": "uint256"
      },
      {
        "name": "approvalData",
        "type": "bytes"
      },
      {
        "name": "maxPossibleCharge",
        "type": "uint256"
      }
    ],
    "name": "acceptRelayedCall",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "bytes"
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
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_goalID",
        "type": "bytes"
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
        "type": "bytes"
      }
    ],
    "name": "liquidateGoalAt",
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
        "type": "bytes"
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
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_goalID",
        "type": "bytes"
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
        "name": "_stravaID",
        "type": "uint256"
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
        "type": "bytes"
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
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      }
    ],
    "name": "getSuccessesClaims",
    "outputs": [
      {
        "name": "",
        "type": "uint256[12]"
      },
      {
        "name": "",
        "type": "uint256[12]"
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
        "name": "_dollars",
        "type": "uint256"
      }
    ],
    "name": "cashout",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getRecipientBalance",
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
    "name": "getUserCount",
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
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "liquidateGoalInstance",
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
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_activityID",
        "type": "uint256"
      },
      {
        "name": "_avgHR",
        "type": "uint256"
      },
      {
        "name": "_reportedMins",
        "type": "uint256"
      }
    ],
    "name": "log",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_status",
        "type": "bool"
      }
    ],
    "name": "setPause",
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
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      }
    ],
    "name": "getGoalArrays",
    "outputs": [
      {
        "name": "",
        "type": "uint256[12]"
      },
      {
        "name": "",
        "type": "uint256[12]"
      },
      {
        "name": "",
        "type": "uint256[12]"
      },
      {
        "name": "",
        "type": "uint256[10]"
      },
      {
        "name": "",
        "type": "uint256[12]"
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
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_userName",
        "type": "bytes"
      },
      {
        "name": "_flag",
        "type": "bytes"
      },
      {
        "name": "_OS",
        "type": "uint256"
      },
      {
        "name": "_email",
        "type": "bytes"
      }
    ],
    "name": "makeProfile",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "context",
        "type": "bytes"
      },
      {
        "name": "success",
        "type": "bool"
      },
      {
        "name": "actualCharge",
        "type": "uint256"
      },
      {
        "name": "preRetVal",
        "type": "bytes32"
      }
    ],
    "name": "postRelayedCall",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMessageData",
    "outputs": [
      {
        "name": "",
        "type": "bytes"
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
        "type": "bytes"
      },
      {
        "name": "_activeMins",
        "type": "uint256"
      },
      {
        "name": "_stakeUSD",
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
        "name": "_stravaID",
        "type": "uint256"
      }
    ],
    "name": "host",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_goalID",
        "type": "bytes"
      }
    ],
    "name": "getGoalPartitions",
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
    "constant": true,
    "inputs": [
      {
        "name": "_stravaID",
        "type": "uint256"
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
        "type": "bytes"
      }
    ],
    "payable": false,
    "stateMutability": "view",
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
    "inputs": [],
    "name": "proxy",
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
    "inputs": [
      {
        "name": "_stravaID",
        "type": "uint256"
      }
    ],
    "name": "getProfile",
    "outputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "bytes"
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
        "name": "_status",
        "type": "bool"
      }
    ],
    "name": "setHalt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_unclaimed",
        "type": "uint256"
      }
    ],
    "name": "LiquidateInstance",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_unclaimed",
        "type": "uint256"
      }
    ],
    "name": "LiquidatedAt",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_wallet",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_userName",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_flag",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_OS",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_email",
        "type": "bytes"
      }
    ],
    "name": "MakeProfile",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_activeMins",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_stakeUSD",
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
        "indexed": true,
        "name": "_startTime",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_ethPricePennies",
        "type": "uint256"
      }
    ],
    "name": "Host",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "indexed": true,
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_ethPricePennies",
        "type": "uint256"
      }
    ],
    "name": "Join",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "indexed": true,
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_activityID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_avgHR",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_reportedMins",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_payout",
        "type": "uint256"
      }
    ],
    "name": "Log",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "indexed": true,
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_cut",
        "type": "uint256"
      }
    ],
    "name": "Claim",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "destToken",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Swap",
    "type": "event"
  }
], '0x457b3d8c4a4727954158e45f524eb2df1ad855a8');