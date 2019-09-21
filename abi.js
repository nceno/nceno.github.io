//initialize portis
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'mainnet', { gasRelay: true, scope: ['email'] });
const web3 = new Web3(portis.provider);

var Nceno = new web3.eth.Contract([
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
    "constant": false,
    "inputs": [
      {
        "name": "_goalID",
        "type": "bytes32"
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
    "constant": false,
    "inputs": [],
    "name": "getPromoCodeCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getTestETH",
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
      },
      {
        "name": "_code",
        "type": "bytes32"
      }
    ],
    "name": "host",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
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
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_code",
        "type": "bytes32"
      }
    ],
    "name": "join",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
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
    "name": "liquidateGoalAt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
        "type": "bytes32"
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
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_userName",
        "type": "bytes32"
      },
      {
        "name": "_flag",
        "type": "bytes32"
      },
      {
        "name": "_OS",
        "type": "uint256"
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
        "name": "relay",
        "type": "address"
      },
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "encoded_function",
        "type": "bytes"
      },
      {
        "name": "success",
        "type": "bool"
      },
      {
        "name": "used_gas",
        "type": "uint256"
      },
      {
        "name": "transaction_fee",
        "type": "uint256"
      }
    ],
    "name": "post_relayed_call",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_eth",
        "type": "uint256"
      }
    ],
    "name": "recoverETH",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
    "name": "setAdmin",
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
    "name": "setHalt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
    "constant": false,
    "inputs": [
      {
        "name": "_code",
        "type": "bytes32"
      }
    ],
    "name": "setPromoCode",
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
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
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
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "_flag",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "_OS",
        "type": "uint256"
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
        "type": "bytes32"
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
        "type": "bytes32"
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
        "type": "bytes32"
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
        "type": "bytes32"
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
        "name": "encoded_function",
        "type": "bytes"
      },
      {
        "name": "gas_price",
        "type": "uint256"
      },
      {
        "name": "transaction_fee",
        "type": "uint256"
      }
    ],
    "name": "accept_relayed_call",
    "outputs": [
      {
        "name": "",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "get_hub_addr",
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
    "name": "get_message_data",
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
    "name": "get_recipient_balance",
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
    "name": "get_sender",
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
        "name": "orig_sender",
        "type": "address"
      },
      {
        "name": "msg_data",
        "type": "bytes"
      }
    ],
    "name": "get_sender_from_data",
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
        "name": "_instance",
        "type": "uint256"
      }
    ],
    "name": "getMyGoalInstance",
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
        "name": "_stravaID",
        "type": "uint256"
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
    "constant": true,
    "inputs": [
      {
        "name": "_stravaID",
        "type": "uint256"
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
        "name": "_goalID",
        "type": "bytes32"
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
        "type": "bytes32[10]"
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
        "type": "bytes32"
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
        "name": "_goalID",
        "type": "bytes32"
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
        "type": "bytes32"
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "goalIDs",
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
        "type": "uint256"
      }
    ],
    "name": "goalInstance",
    "outputs": [
      {
        "name": "goalID",
        "type": "bytes32"
      },
      {
        "name": "startTime",
        "type": "uint256"
      },
      {
        "name": "activeMins",
        "type": "uint256"
      },
      {
        "name": "wks",
        "type": "uint256"
      },
      {
        "name": "stakeUSD",
        "type": "uint256"
      },
      {
        "name": "sesPerWk",
        "type": "uint256"
      },
      {
        "name": "competitorCount",
        "type": "uint256"
      },
      {
        "name": "unclaimedStake",
        "type": "uint256"
      },
      {
        "name": "liquidated",
        "type": "bool"
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
    "name": "profileOf",
    "outputs": [
      {
        "name": "stravaID",
        "type": "uint256"
      },
      {
        "name": "userName",
        "type": "bytes32"
      },
      {
        "name": "walletAdr",
        "type": "address"
      },
      {
        "name": "born",
        "type": "uint256"
      },
      {
        "name": "flag",
        "type": "bytes32"
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
  }
], '0x59321E308a55C8316413F7CD118C55123c32772e');