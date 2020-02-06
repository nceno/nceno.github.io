//initialize portis
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'rinkeby', { gasRelay: true, scope: ['email'] });
const web3 = new Web3(portis.provider);

var NcenoBrands = new web3.eth.Contract([
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
        "name": "_codes",
        "type": "string[10]"
      }
    ],
    "name": "addInviteCodes",
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
        "name": "_newName",
        "type": "string"
      }
    ],
    "name": "changeUsername",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_company",
        "type": "bytes"
      }
    ],
    "name": "emptyContract",
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
        "name": "_status",
        "type": "bool"
      }
    ],
    "name": "halt",
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
        "name": "_start",
        "type": "uint256"
      },
      {
        "name": "_days",
        "type": "uint256"
      },
      {
        "name": "_cap",
        "type": "uint256"
      },
      {
        "name": "_pot",
        "type": "uint256"
      },
      {
        "name": "_KmReward",
        "type": "uint256"
      },
      {
        "name": "_BpmReward",
        "type": "uint256"
      },
      {
        "name": "_token",
        "type": "address"
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
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_userName",
        "type": "string"
      },
      {
        "name": "_avatar",
        "type": "uint256"
      },
      {
        "name": "_inviteCode",
        "type": "string"
      }
    ],
    "name": "join",
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
        "name": "_kms",
        "type": "uint256"
      },
      {
        "name": "_mins",
        "type": "uint256"
      },
      {
        "name": "_actID",
        "type": "uint256"
      },
      {
        "name": "_secret",
        "type": "bytes"
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
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_companyID",
        "type": "bytes"
      },
      {
        "name": "_BrandToken_Address",
        "type": "address"
      },
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "makeCompany",
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
        "name": "_companyID",
        "type": "bytes"
      },
      {
        "name": "_orderNum",
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "name": "_item",
        "type": "string"
      },
      {
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "makeOrder",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_supply",
        "type": "uint256"
      },
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_symbol",
        "type": "string"
      },
      {
        "name": "_companyName",
        "type": "string"
      },
      {
        "name": "_relayHub",
        "type": "address"
      }
    ],
    "name": "makeToken",
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
    "constant": false,
    "inputs": [
      {
        "name": "_orderNum",
        "type": "bytes"
      },
      {
        "name": "_refunded",
        "type": "bool"
      },
      {
        "name": "_settled",
        "type": "bool"
      }
    ],
    "name": "updateOrder",
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
        "indexed": false,
        "name": "_wallet",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_userName",
        "type": "string"
      }
    ],
    "name": "MakeUser",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "MakeGoal",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_companyID",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_name",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "MakeCompany",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_companyID",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_orderNum",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_buyer",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_item",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_date",
        "type": "uint256"
      }
    ],
    "name": "MakeOrder",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "indexed": false,
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
        "name": "_inviteCode",
        "type": "string"
      }
    ],
    "name": "Join",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_stravaID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_kms",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_mins",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_actID",
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
        "indexed": false,
        "name": "_symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_supply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_company",
        "type": "string"
      }
    ],
    "name": "MakeToken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_orderNumber",
        "type": "bytes"
      },
      {
        "indexed": false,
        "name": "_refunded",
        "type": "bool"
      },
      {
        "indexed": false,
        "name": "_settled",
        "type": "bool"
      }
    ],
    "name": "UpdateOrder",
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
    "inputs": [
      {
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "companyAt",
    "outputs": [
      {
        "name": "companyID",
        "type": "bytes"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "orderCount",
        "type": "uint256"
      },
      {
        "name": "token",
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
        "type": "bytes"
      }
    ],
    "name": "companyExists",
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
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "companyOf",
    "outputs": [
      {
        "name": "companyID",
        "type": "bytes"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "orderCount",
        "type": "uint256"
      },
      {
        "name": "token",
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
        "name": "_companyID",
        "type": "bytes"
      },
      {
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getIndexedOrder",
    "outputs": [
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
        "name": "_goalID",
        "type": "bytes"
      },
      {
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getIndexedPlayerID",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "string"
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
    "name": "getNcenoStats",
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
        "type": "bytes"
      },
      {
        "name": "_stravaID",
        "type": "uint256"
      }
    ],
    "name": "getPlayer",
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
    "name": "playerStatus",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "profileOf",
    "outputs": [
      {
        "name": "wallet",
        "type": "address"
      },
      {
        "name": "stravaID",
        "type": "uint256"
      },
      {
        "name": "userName",
        "type": "string"
      },
      {
        "name": "avatar",
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
        "name": "_orderNum",
        "type": "bytes"
      }
    ],
    "name": "searchOrders",
    "outputs": [
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
], '0x49c6de5de57589b506b26a0ff9de6eaf90a404a2');