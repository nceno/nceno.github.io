//initialize portis
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'ropsten', { gasRelay: true, scope: ['email'] });
const web3 = new Web3(portis.provider);

var Nceno = new web3.eth.Contract([
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
    "constant": false,
    "inputs": [
      {
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_userName",
        "type": "string"
      },
      {
        "name": "_flag",
        "type": "string"
      },
      {
        "name": "_OS",
        "type": "uint256"
      },
      {
        "name": "_email",
        "type": "string"
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
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_flag",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_OS",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_email",
        "type": "string"
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
        "type": "string"
      },
      {
        "name": "walletAdr",
        "type": "address"
      },
      {
        "name": "email",
        "type": "string"
      },
      {
        "name": "born",
        "type": "uint256"
      },
      {
        "name": "flag",
        "type": "string"
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
], '0xee90631e15dd666930f0ce991a494ebd331d58c4');