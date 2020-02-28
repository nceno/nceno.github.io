//makeCompany: "Suntek Global","0xccff00","0xe3d06e15f286bcaaa28528b61da84737318eefc4","0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a"
//transfer: "0x1995095fedc772f55c0279cd6f1ca45a4a28cf86","600"
//host: "0xccff00","1581724800","30","150","600","1","2","0xc7edfa037540d5bc89110d51c1aabc3fdebc8067"


//join: "0xccff00","39706111","joenance","0","one","0"
//log: "0xccff00","39706111","8","0","666","0x121212","1"
//make order: "0xccff00","0xccff00","0x666aaa","39706111","beer","12", "0"


pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";
import "./ERC20Interface.sol";


contract NcenoBrands is RelayRecipient{

  event MakeUser(address _wallet, uint _stravaID, string _userName);
  event MakeOrder(bytes indexed paramGoalID, bytes _orderNum, uint _buyer, string _item, uint _price, uint _date);
  event Join(bytes paramGoalID, uint _stravaID, string _userName, string _inviteCode);
  event Log(bytes indexed paramGoalID, uint indexed paramStravaID, uint _kms, uint _mins, uint _actID, bool indexed finisher);
  event UpdateOrder(bytes indexed paramGoalID, bytes _orderNumber, uint _status);
  
  //gas station init
  constructor() public {
    setRelayHub(IRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494));
  }

  //objects
  struct company{
    bytes companyID;
    string name;
    address owner;
    mapping(bytes=>goal) goalSet;
    mapping(bytes=>order) orderSet; ////////
    uint orderCount;
    mapping(uint=>order) indexedOrder; ///////
    mapping(uint=>bytes) indexedOrderNumber; //////
    address token;
  }
  mapping(bytes=>company) public companyAt;
  mapping(address=>company) public companyOf;
  mapping(bytes=>bool) public companyExists;
  uint companyCount=0;
  uint payoutToDate=0;

  struct goal{
    uint rewardMult;
    bool halted;
    mapping(string=>bool) codeOk;
    bytes goalID;
    uint start;
    uint dur;
    uint tokenCap;
    uint tokenPot;
    uint potRemaining;
    uint kmTokenRate;
    uint bpmTokenRate;
    address owner;
    uint compCount;
    address token;
    //uint cutoff;
    string[3] first3;
    uint finishers;
    mapping(uint=>uint) q1Answers; // answer --> count
    mapping(uint=>uint) q2Answers; // index --> answer
      uint q2Count;
      //mapping(uint=>bool) playerAnsweredQ2; //stravaID --> true/false
    mapping(uint=>uint) q3Answers; // answer --> count
    mapping(uint=>uint) q4Answers; // answer --> count

    mapping(uint=>uint) playerSet;
    mapping(uint=>uint) indexedPlayerID;
    mapping(uint=>uint) playerKms;
    mapping(uint=>uint) playerMins;
    mapping(uint=>uint) playerPayout;
    mapping(uint=>uint) lastLog;

    mapping(uint=>bool) activitySpent;
    mapping(uint=>bool) isPlayer;
  }

  mapping(bytes => goal) goalAt;
  uint goalCount=0;
  uint kmCount=0;
  uint minsCount=0;

  struct player{
    address wallet;
    uint stravaID;
    string userName;
    string[4] avatar;
    mapping(bytes=>order) orderSet;
    uint orderCt;
    mapping(bytes=>goal) goalSet;
  }
  mapping(uint=>mapping(uint=>bytes)) playerOrders; //stravaID => orderIndex => orderNum


  mapping(uint=>player) public profileOf;
  mapping(uint=>bool) public userExists;
  uint userCount=0;

  struct order{
    bytes orderNum;
    string item;
    uint stravaBuyer;
    uint price;
    uint date;
    uint status;
    bytes company;
  }
  mapping(bytes=>order) orderAt;
  uint orderCount=0;

  //called by nceno admin
  function addInviteCodes(bytes memory _goalID, string[10] memory _codes) public onlyNcenoAdmin{
    for(uint i =0; i<10; i++){
      goalAt[_goalID].codeOk[_codes[i]]=true;
    }
  }
  //---- /objects

  //main functions

  //called by nceno admin
  function makeCompany(string memory _name, bytes memory _companyID, address _BrandToken_Address, address _owner) public{
    company memory createdCompany = company({
      name : _name,
      companyID : _companyID,
      //add an _owner parameter?
      owner: _owner,
      token: _BrandToken_Address,
      orderCount:0
    });
    companyExists[_companyID] = true;
    companyAt[_companyID] = createdCompany;
    companyCount++;

    //(make token separately first before company)
    
  }

  function host(bytes memory _goalID, uint _start, uint _days, uint _cap, uint _pot, uint _KmReward, uint _BpmReward, address _token) public payable{
    goal memory createdGoal = goal({
      halted: false,
      goalID: _goalID,
      start: _start,
      dur: _days,
      tokenCap: _cap,
      tokenPot: _pot,
      potRemaining: _pot,
      kmTokenRate: _KmReward,
      bpmTokenRate:_BpmReward,
      owner: getSender(),
      compCount:0,
      q2Count: 0,
      finishers: 0,
      first3: ["0","0","0"],
      token: _token,
      rewardMult : 1
      //cutoff: _cutoff
    });

    //replace getSender() with _owner parameter?
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;
    goalCount++;

    //(transfer the tokens as a deposit in the UI separately in the callback)

    
  }

  function join(bytes memory _goalID, uint _stravaID, string memory _userName, string[4] memory _avatar, string memory _inviteCode, uint _q1Answer, uint _q2Answer) public {
    require(now < goalAt[_goalID].start+goalAt[_goalID].dur*1 days
      && goalAt[_goalID].isPlayer[_stravaID] == false 
      && goalAt[_goalID].halted == false
      && goalAt[_goalID].codeOk[_inviteCode]==true,"error");
      //&& goalAt[_goalID].compCount<goalAt[_goalID].cutoff,"error");
      

    if(userExists[_stravaID] == false){
      player memory createdPlayer = player({
        stravaID : _stravaID,
        userName : _userName,
        avatar : _avatar,
        orderCt: 0,
        wallet : getSender()
      });
      profileOf[_stravaID] = createdPlayer;
      userExists[_stravaID] = true;
      userCount++;
      emit MakeUser(getSender(), _stravaID, _userName);
    }

    profileOf[_stravaID].avatar = _avatar;
    profileOf[_stravaID].userName = _userName;

    goalAt[_goalID].playerSet[0]=_stravaID;
    goalAt[_goalID].indexedPlayerID[goalAt[_goalID].compCount]=_stravaID;
    goalAt[_goalID].playerKms[_stravaID] = 0;
    goalAt[_goalID].playerMins[_stravaID] = 0;
    goalAt[_goalID].isPlayer[_stravaID]=true;
    goalAt[_goalID].compCount++;

    goalAt[_goalID].q1Answers[_q1Answer]++;

   
    goalAt[_goalID].q2Answers[goalAt[_goalID].q2Count]=_q2Answer;
    goalAt[_goalID].q2Count++;
    

    goalAt[_goalID].codeOk[_inviteCode]==false;
    emit Join(_goalID,_stravaID, _userName, _inviteCode);
  }

  function log(bytes memory _goalID, uint _stravaID, uint _kms, uint _mins, uint _actID, bytes memory _secretHash, uint _secretIndex) public{
    require(now-goalAt[_goalID].lastLog[_stravaID] >13 hours 
      && now > goalAt[_goalID].start 
      && now < goalAt[_goalID].start+goalAt[_goalID].dur*1 days 
      /*&& keccak256(_secret) == keccak256('masterhash')*/
      && goalAt[_goalID].halted == false
      && goalAt[_goalID].potRemaining>0
      && goalAt[_goalID].playerPayout[_stravaID]<goalAt[_goalID].tokenCap,"error");
    goalAt[_goalID].playerKms[_stravaID]+= _kms;
    goalAt[_goalID].playerMins[_stravaID]+= _mins;
    uint payout = goalAt[_goalID].rewardMult*_kms*goalAt[_goalID].kmTokenRate + _mins*goalAt[_goalID].bpmTokenRate/10;
    //if the payout is more than remaining, just pay remaining tokens
    if(goalAt[_goalID].potRemaining<payout){
      payout = goalAt[_goalID].potRemaining;
    }
    //if it will put the player past their token cap, just pay remaining room
    if(payout+goalAt[_goalID].playerPayout[_stravaID] > goalAt[_goalID].tokenCap){
      payout = goalAt[_goalID].tokenCap - goalAt[_goalID].playerPayout[_stravaID];
    }

    //---- token payout
    ERC20 companyToken = ERC20(goalAt[_goalID].token);
    companyToken.transfer(getSender(), payout);
    //----/ token payout



    goalAt[_goalID].potRemaining-=payout;

    goalAt[_goalID].activitySpent[_actID] = true;
    goalAt[_goalID].lastLog[_stravaID] = now;
    goalAt[_goalID].playerPayout[_stravaID] += payout;

    bool finisher = false;
    if((goalAt[_goalID].playerPayout[_stravaID]+payout >= goalAt[_goalID].tokenCap) && goalAt[_goalID].finishers<3){
      goalAt[_goalID].first3[goalAt[_goalID].finishers]=profileOf[_stravaID].userName;
      finisher = true;
      goalAt[_goalID].finishers++;
    }

    kmCount+=_kms;
    minsCount+=_mins;
    payoutToDate+=payout;
    emit Log(_goalID, _stravaID, _kms, _mins, _actID, finisher);
  }
  
  function makeOrder(bytes memory _goalID, bytes memory _companyID, bytes memory _orderNum, uint _stravaID, string memory _item, uint _price, uint _q3Answer, uint _q4Answer) public{
    require(goalAt[_goalID].halted == false,"error");

    //(transfer tokens to owner first)

    order memory createdOrder = order ({
      orderNum: _orderNum,
      item: _item,
      stravaBuyer: _stravaID,
      price: _price,
      date: now,
      status: 0,
      company: _companyID
    });

    //bug check these....
    companyAt[_companyID].orderSet[_orderNum]=createdOrder;
    profileOf[_stravaID].orderSet[_orderNum]=createdOrder;
    companyAt[_companyID].indexedOrder[orderCount]=createdOrder;
    
    companyAt[_companyID].indexedOrderNumber[orderCount] = _orderNum;
    
    orderAt[_orderNum]=createdOrder;
    //orderAt[playerOrders[_stravaID][profileOf[_stravaID].orderCt]] = createdOrder; //may have a problem
    //stravaID => [orderIndex => orderNum]
    playerOrders[_stravaID][profileOf[_stravaID].orderCt] = _orderNum; 

    goalAt[_goalID].q3Answers[_q3Answer]++;
    goalAt[_goalID].q4Answers[_q4Answer]++;



    orderCount++;
    companyAt[_companyID].orderCount++;
    profileOf[_stravaID].orderCt++;
    
    emit MakeOrder(_goalID, _orderNum, _stravaID, _item, _price, now);
    
  }

  function setOrderStatus(bytes memory _goalID, bytes memory _orderNum, uint _status) public{
    orderAt[_orderNum].status = _status;
    //companyAt[_companyID].indexedOrder[_index].status    //this is what is returned when getting the status and building the list
    //orderAt[_orderNum].status     //this is what is returned by order search.
    //companyAt[_companyID].indexedOrder[magic index]  //need to find correct index and set this.
    emit UpdateOrder(_goalID, _orderNum, _status);
  }

  function setRewMult(bytes memory _goalID, uint _mult) public{
    goalAt[_goalID].rewardMult = _mult;
  }
  function getRewMult(bytes memory _goalID) public view returns(uint){
    return(goalAt[_goalID].rewardMult);
  }

  function halt(bytes memory _goalID, bool _status) public{
    require(goalAt[_goalID].owner == getSender(),"error");
    goalAt[_goalID].halted = _status;
  }

  function emptyContract(address _token, bytes memory _company) public{
    require(getSender() == companyAt[_company].owner && companyAt[_company].token == _token, "sender not authorized.");
    ERC20 companyToken = ERC20(_token);
    companyToken.transfer(getSender(), address(this).balance);
  }


  //---- /main functions

  //used for workout quickstats screen and getting comp count for function below
  function getGoalParams(bytes memory _goalID) public view returns(uint, uint, uint, uint, uint, uint, uint){
    return(goalAt[_goalID].start, goalAt[_goalID].dur, goalAt[_goalID].tokenCap, goalAt[_goalID].compCount, goalAt[_goalID].potRemaining, goalAt[_goalID].bpmTokenRate, goalAt[_goalID].kmTokenRate);
    //goalID --> start0, dur1, tokenCap2, compcount3, remainingTokens4, bpmReward5, kmReward6
  }






  //used to generate the leaderboard
  function getIndexedPlayerID(bytes memory _goalID, uint _index) public view returns(uint, string memory){
    return(goalAt[_goalID].indexedPlayerID[_index], profileOf[goalAt[_goalID].indexedPlayerID[_index]].userName );
    //goalID, index --> stravaID0, username1
  }

    //get order count for order list
  function getCompanyOrderCt(bytes memory _companyID) public view returns(uint){
    return(companyAt[_companyID].orderCount);
  }

  //assuming each challenge has its own contract, this gets the order count for a player in that challenge.
  function getPlayerOrderCt(uint _stravaID) public view returns(uint){
    return(profileOf[_stravaID].orderCt);
  }

  function seeFirst3(bytes memory _goalID)public view returns(string[3] memory){
    return(goalAt[_goalID].first3);
  }

  function playerStatus(bytes memory _goalID, uint _stravaID) public view returns(bool){
    return (goalAt[_goalID].isPlayer[_stravaID]);
  }






  //useful for workout quickstats screen
  function getPlayer(bytes memory _goalID, uint _stravaID) public view returns(uint, uint, uint, uint, string[4] memory){
    return(goalAt[_goalID].playerKms[_stravaID], goalAt[_goalID].playerMins[_stravaID], goalAt[_goalID].playerPayout[_stravaID], goalAt[_goalID].lastLog[_stravaID],profileOf[_stravaID].avatar );
    //goalID, stravaID --> kms0, mins1, reward2, lastLogTime3, avatar4
  }


  //used to generate order list
  function getIndexedOrder(bytes memory _companyID, uint _index) public view returns(string memory, string memory, uint, uint, uint, bytes memory){
    return(companyAt[_companyID].indexedOrder[_index].item, profileOf[companyAt[_companyID].indexedOrder[_index].stravaBuyer].userName, companyAt[_companyID].indexedOrder[_index].price, companyAt[_companyID].indexedOrder[_index].date, orderAt[companyAt[_companyID].indexedOrderNumber[_index]].status, companyAt[_companyID].indexedOrder[_index].orderNum);    
    //companyID, index --> item0, buyerName1, price2, date3, status4, orderNo5
  }

  //used to generate player order history
  function getIndexedPlayerOrder(uint _stravaID, uint _index) public view returns(bytes memory, string memory, uint, uint){
    return(playerOrders[_stravaID][_index], orderAt[playerOrders[_stravaID][_index]].item, orderAt[playerOrders[_stravaID][_index]].price, orderAt[playerOrders[_stravaID][_index]].date );
    //stravaID, index --> ordernum0, item1, price2, date3
  }

  //used for order search
  function searchOrders(bytes memory _orderNum) public view returns(string memory, string memory, uint, uint, uint){
    return(orderAt[_orderNum].item, profileOf[orderAt[_orderNum].stravaBuyer].userName, orderAt[_orderNum].price, orderAt[_orderNum].date, orderAt[_orderNum].status );
    //orderNo --> item0, buyerName1, price2, date3, status4
  }



  //combo function
  //getQ1a, getQ2count, getQ2a, getQ3a, getQ4a
 /* function getQstuff(bytes memory _goalID, uint _Q1a, uint _Q2index, uint _Q3a, uint _Q4a) public returns (uint, uint, uint, uint, uint){
    return (goalAt[_goalID].q1Answers[_Q1a], goalAt[_goalID].q2Count,  goalAt[_goalID].q2Answers[_Q2index], goalAt[_goalID].q3Answers[_Q3a], goalAt[_goalID].q3Answers[_Q4a] );
  }*/
  //----- /getters

  //gas station relay stuff

  function acceptRelayedCall(address relay, address from, bytes calldata encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes calldata approvalData, uint256 maxPossibleCharge) external view returns (uint256, bytes memory) {
      return (0, "");
    }

    function preRelayedCall(bytes calldata context) /*relayHubOnly*/ external returns (bytes32) {
      return bytes32(uint(123456));
    }

    function postRelayedCall(bytes calldata context, bool success, uint actualCharge, bytes32 preRetVal) /*relayHubOnly*/ external {
    }
    
    function _withdrawDeposits(uint256 amount, address payable payee) external onlyNcenoAdmin{
    }


  //---  /gas station relay stuff

  address ncenoAdmin = 0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a; //portis mainnet
  function setNcenoAdmin(address _newAdmin) onlyNcenoAdmin external{
    ncenoAdmin = _newAdmin;
  }

  modifier onlyNcenoAdmin(){
    require(getSender() == ncenoAdmin,"Sender not authorized.");
    _;
  } 
}

// token factory stuff
contract BrandToken is RelayRecipient{
  constructor(uint _supply, address _owner, string memory _symbol, string memory _name) public {
    balances[_owner]= _supply;
    thetotalSupply = _supply;
    name = _name;
    decimals = 0;
    symbol = _symbol;
    //relayHub = address(0xD216153c06E857cD7f72665E0aF1d7D82172F494);
    //setRelayHub(IRelayHub(relayHub));
    //0xD216153c06E857cD7f72665E0aF1d7D82172F494
  }

  mapping(address => uint256) balances;
  mapping(address => mapping (address => uint256)) allowed;
  uint public  thetotalSupply;
  string public name;
  uint8 public decimals;
  string public symbol;
  
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  function totalSupply() public returns (uint256 theTotalSupply) {
    return theTotalSupply;
  }
  
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }
  
  function approve(address _spender, uint256 _amount) public returns (bool success) {
    allowed[getSender()][_spender] = _amount;
    emit Approval(getSender(), _spender, _amount);
    return true;
  }
  
  function transfer(address _to, uint256 _amount) public returns (bool success) {
    if (balances[getSender()] >= _amount && _amount > 0 && balances[_to] + _amount > balances[_to]) {
      balances[getSender()] -= _amount;
      balances[_to] += _amount;
      emit Transfer(getSender(), _to, _amount);
      return true;
    } else {return false;}
  }
   
  function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {
    if (balances[_from] >= _amount && allowed[_from][getSender()] >= _amount && _amount > 0 && balances[_to] + _amount > balances[_to]) {
      balances[_from] -= _amount;
      balances[_to] += _amount;
      emit Transfer(_from, _to, _amount);
      return true;
    } else {return false;}
  }
  
  function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

   //gas station relay stuff

  function acceptRelayedCall(address relay, address from, bytes calldata encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes calldata approvalData, uint256 maxPossibleCharge) external view returns (uint256, bytes memory) {
      return (0, "");
    }

    function preRelayedCall(bytes calldata context) /*relayHubOnly*/ external returns (bytes32) {
      return bytes32(uint(123456));
    }

    function postRelayedCall(bytes calldata context, bool success, uint actualCharge, bytes32 preRetVal) /*relayHubOnly*/ external {
    }
    
    function _withdrawDeposits(uint256 amount, address payable payee) external onlyNcenoAdmin{
    }
  //---  /gas station relay stuff

  address ncenoAdmin = 0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a; //portis mainnet
  function setNcenoAdmin(address _newAdmin) onlyNcenoAdmin external{
    ncenoAdmin = _newAdmin;
  }

  modifier onlyNcenoAdmin(){
    require(getSender() == ncenoAdmin,"Sender not authorized.");
    _;
  } 
}