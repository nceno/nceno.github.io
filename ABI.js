const TokenLauncherABI=[
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
        "name": "_supply",
        "type": "uint256"
      },
      {
        "name": "_symbol",
        "type": "string"
      },
      {
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "newToken",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_newToken",
        "type": "address"
      }
    ],
    "name": "TokenDeployed",
    "type": "event"
  }
];
const BrandTokenABI=[
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
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
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
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
        "name": "_adminAddress",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "theTotalSupply",
        "type": "uint256"
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
        "name": "_vcode",
        "type": "bytes"
      }
    ],
    "name": "readyVoucher",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
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
        "name": "_adminAddress",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
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
    "inputs": [],
    "name": "thetotalSupply",
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
    "constant": false,
    "inputs": [
      {
        "name": "_recipient",
        "type": "address"
      },
      {
        "name": "_vcode",
        "type": "bytes"
      }
    ],
    "name": "giftVoucher",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
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
    "constant": false,
    "inputs": [
      {
        "name": "_item",
        "type": "string"
      },
      {
        "name": "_vcode",
        "type": "bytes"
      },
      {
        "name": "_chalAdr",
        "type": "address"
      }
    ],
    "name": "makeVoucher",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_vcode",
        "type": "bytes"
      }
    ],
    "name": "redeemVoucher",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
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
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "remaining",
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
        "name": "_name",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
];
const ChallengeLauncherABI=[
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
        "name": "_start",
        "type": "uint256"
      },
      {
        "name": "_dur",
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
        "name": "_kmTokenRate",
        "type": "uint256"
      },
      {
        "name": "_bpmTokenRate",
        "type": "uint256"
      },
      {
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "newChallenge",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_newChallenge",
        "type": "address"
      }
    ],
    "name": "ChallengeDeployed",
    "type": "event"
  }
];
const ChallengeABI=[
  {
    "constant": false,
    "inputs": [
      {
        "name": "_codes",
        "type": "bytes[10]"
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
        "name": "_days",
        "type": "uint256"
      }
    ],
    "name": "changeExp",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_adminAddress",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
    "name": "itemExpDate",
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
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "kickPlayer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_items",
        "type": "string[5]"
      },
      {
        "name": "_prices",
        "type": "uint256[5]"
      }
    ],
    "name": "addItems",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_inviteCode",
        "type": "bytes"
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
        "name": "_status",
        "type": "bool"
      }
    ],
    "name": "haltStatus",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_admin",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
    "constant": false,
    "inputs": [
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
        "name": "_secretHash",
        "type": "bytes"
      },
      {
        "name": "_currentBlock",
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
        "type": "string"
      }
    ],
    "name": "priceOf",
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
    "inputs": [],
    "name": "emptyContract",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getRewMult",
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
        "name": "_mult",
        "type": "uint256"
      }
    ],
    "name": "setRewMult",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_start",
        "type": "uint256"
      },
      {
        "name": "_dur",
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
        "name": "_kmTokenRate",
        "type": "uint256"
      },
      {
        "name": "_bpmTokenRate",
        "type": "uint256"
      },
      {
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
];
const RelayHubABI=[
  {
    "constant": false,
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "dest",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "transactionFee",
        "type": "uint256"
      },
      {
        "name": "url",
        "type": "string"
      }
    ],
    "name": "registerRelay",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
        "name": "to",
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
        "name": "signature",
        "type": "bytes"
      },
      {
        "name": "approvalData",
        "type": "bytes"
      }
    ],
    "name": "canRelay",
    "outputs": [
      {
        "name": "status",
        "type": "uint256"
      },
      {
        "name": "recipientContext",
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
        "name": "recipient",
        "type": "address"
      },
      {
        "name": "encodedFunctionWithFrom",
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
        "name": "preChecksGas",
        "type": "uint256"
      },
      {
        "name": "recipientContext",
        "type": "bytes"
      }
    ],
    "name": "recipientCallsAtomic",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
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
        "name": "from",
        "type": "address"
      }
    ],
    "name": "getNonce",
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
        "name": "unsignedTx",
        "type": "bytes"
      },
      {
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "penalizeIllegalTransaction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "recipient",
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
        "name": "signature",
        "type": "bytes"
      },
      {
        "name": "approvalData",
        "type": "bytes"
      }
    ],
    "name": "relayCall",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "version",
    "outputs": [
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
    "inputs": [
      {
        "name": "relayedCallStipend",
        "type": "uint256"
      }
    ],
    "name": "requiredGas",
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
        "name": "target",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
      }
    ],
    "name": "canUnstake",
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
        "name": "relay",
        "type": "address"
      }
    ],
    "name": "getRelay",
    "outputs": [
      {
        "name": "totalStake",
        "type": "uint256"
      },
      {
        "name": "unstakeDelay",
        "type": "uint256"
      },
      {
        "name": "unstakeTime",
        "type": "uint256"
      },
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "state",
        "type": "uint8"
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
        "name": "relayedCallStipend",
        "type": "uint256"
      },
      {
        "name": "gasPrice",
        "type": "uint256"
      },
      {
        "name": "transactionFee",
        "type": "uint256"
      }
    ],
    "name": "maxPossibleCharge",
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
        "name": "unsignedTx1",
        "type": "bytes"
      },
      {
        "name": "signature1",
        "type": "bytes"
      },
      {
        "name": "unsignedTx2",
        "type": "bytes"
      },
      {
        "name": "signature2",
        "type": "bytes"
      }
    ],
    "name": "penalizeRepeatedNonce",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "target",
        "type": "address"
      }
    ],
    "name": "depositFor",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
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
        "name": "unstakeDelay",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "relay",
        "type": "address"
      }
    ],
    "name": "removeRelayByOwner",
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
      }
    ],
    "name": "unstake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "relay",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "stake",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "unstakeDelay",
        "type": "uint256"
      }
    ],
    "name": "Staked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "relay",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "transactionFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "stake",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "unstakeDelay",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "url",
        "type": "string"
      }
    ],
    "name": "RelayAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "relay",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "unstakeTime",
        "type": "uint256"
      }
    ],
    "name": "RelayRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "relay",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "Unstaked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "dest",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "relay",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "selector",
        "type": "bytes4"
      },
      {
        "indexed": false,
        "name": "reason",
        "type": "uint256"
      }
    ],
    "name": "CanRelayFailed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "relay",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "selector",
        "type": "bytes4"
      },
      {
        "indexed": false,
        "name": "status",
        "type": "uint8"
      },
      {
        "indexed": false,
        "name": "charge",
        "type": "uint256"
      }
    ],
    "name": "TransactionRelayed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "relay",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Penalized",
    "type": "event"
  }
]