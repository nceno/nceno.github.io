//makeCompany: "Suntek Global","0xccff00959f043d6e2926793d85a8cde6adccff00","0x619201959f043d6e2926793d85a8cde6ad755ef8", "0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a"
//deposit: "0xf34c124a29229a5cf5b63be4bb9a6778d1847012","10"
//host: "0xccff00","1579588026","30","3","10","1","2","0x619201959f043d6e2926793d85a8cde6ad755ef8"
//addinvite codes: "0xccff00",["red", "orange", "yellow", "green", "blue", "indigo", "violet", "white", "black", "gray"]
//join: "0xccff00","39706111","joenance","0","red"
//log: "0xccff00","39706111","1","0","666","0x121212"
//make order: "0xccff00","0xccff00959f043d6e2926793d85a8cde6adccff00","0x666aaa","39706111","beer","12"


pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";
import "./ERC20Interface.sol";


contract NcenoBrands is RelayRecipient{

  event MakeUser(address _wallet, uint _stravaID, string _userName);
  event MakeGoal(bytes _goalID, address _owner);
  event MakeCompany(bytes _companyID, string _name, address owner);
  event MakeOrder(bytes _companyID, bytes _orderNum, uint _buyer, string _item, uint _price, uint _date);
  event Join(bytes _goalID, uint _stravaID, string _userName, string _inviteCode);
  event Log(bytes _goalID, uint _stravaID, uint _kms, uint _mins, uint _actID);
  event MakeToken(string _symbol, address _address, uint _supply, address _owner, string _company);
  event UpdateOrder(bytes _orderNumber, bool _refunded, bool _settled);
  
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
    mapping(bytes=>order) orderSet;
    uint orderCount;
    mapping(uint=>order) indexedOrder;
    address token;
  }
  mapping(bytes=>company) public companyAt;
  mapping(address=>company) public companyOf;
  mapping(bytes=>bool) public companyExists;
  uint companyCount=0;
  uint payoutToDate=0;

  struct goal{
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
    uint avatar;
    mapping(bytes=>order) orderSet;
    mapping(bytes=>goal) goalSet;
  }
  mapping(uint=>player) public profileOf;
  mapping(uint=>bool) public userExists;
  uint userCount=0;

  struct order{
    bytes orderNum;
    string item;
    uint stravaBuyer;
    uint price;
    uint date;
    bool refunded;
    bool settled;
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
  function changeUsername(uint _stravaID, string memory _newName)public{
    require(profileOf[_stravaID].wallet==getSender(),"error");
    profileOf[_stravaID].userName = _newName;
  }

  //called by nceno admin
  function makeToken(uint _supply, address _owner, string memory _symbol, string memory _companyName, address _relayHub) public returns(address){
    BrandToken createdToken = new BrandToken(_supply, _owner, _symbol, _companyName, _relayHub);
    emit MakeToken(_symbol, address(createdToken), _supply, _owner, _companyName);
    return address(createdToken);
  }
  
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
    emit MakeCompany(_companyID, _name, _owner);
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
      token: _token
    });

    //replace getSender() with _owner parameter?
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;
    goalCount++;

    //(transfer the tokens as a deposit in the UI separately in the callback)

    emit MakeGoal(_goalID, getSender());
  }

  function join(bytes memory _goalID, uint _stravaID, string memory _userName, uint _avatar, string memory _inviteCode) public {
    require(now < goalAt[_goalID].start+goalAt[_goalID].dur*1 days
      && goalAt[_goalID].isPlayer[_stravaID] == false 
      && goalAt[_goalID].halted == false
      && goalAt[_goalID].codeOk[_inviteCode]==true,"error");
      

    if(userExists[_stravaID] == false){
      player memory createdPlayer = player({
        stravaID : _stravaID,
        userName : _userName,
        avatar : _avatar,
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

    goalAt[_goalID].codeOk[_inviteCode]==false;
    emit Join(_goalID,_stravaID, _userName, _inviteCode);
  }

  function log(bytes memory _goalID, uint _stravaID, uint _kms, uint _mins, uint _actID, bytes memory _secret) public{
    require(now-goalAt[_goalID].lastLog[_stravaID] >13 hours 
      && now > goalAt[_goalID].start 
      && now < goalAt[_goalID].start+goalAt[_goalID].dur*1 days 
      /*&& keccak256(_secret) == keccak256('masterhash')*/
      && goalAt[_goalID].halted == false
      && goalAt[_goalID].potRemaining>0
      && goalAt[_goalID].playerPayout[_stravaID]<goalAt[_goalID].tokenCap,"error");
    goalAt[_goalID].playerKms[_stravaID]+= _kms;
    goalAt[_goalID].playerMins[_stravaID]+= _mins;
    uint payout = _kms*goalAt[_goalID].kmTokenRate + _mins*goalAt[_goalID].bpmTokenRate;
    if(goalAt[_goalID].potRemaining<payout){
      payout = goalAt[_goalID].potRemaining;
    }
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
    kmCount+=_kms;
    minsCount+=_mins;
    payoutToDate+=payout;
    emit Log(_goalID, _stravaID, _kms, _mins, _actID);
  }
  
  function makeOrder(bytes memory _goalID, bytes memory _companyID, bytes memory _orderNum, uint _stravaID, string memory _item, uint _price) public{
    require(goalAt[_goalID].halted == false,"error");

    //(transfer tokens to owner first)

    order memory createdOrder = order ({
      orderNum: _orderNum,
      item: _item,
      stravaBuyer: _stravaID,
      price: _price,
      date: now,
      refunded: false,
      settled: false,
      company: _companyID
    });
    companyAt[_companyID].orderSet[_orderNum]=createdOrder;
    profileOf[_stravaID].orderSet[_orderNum]=createdOrder;
    companyAt[_companyID].indexedOrder[orderCount]=createdOrder;
    orderAt[_orderNum]=createdOrder;
    orderCount++;
    companyAt[_companyID].orderCount++;
    
    emit MakeOrder(_companyID, _orderNum, _stravaID, _item, _price, now);
  }

  function updateOrder(bytes memory _orderNum, bool _refunded, bool _settled) public{
    orderAt[_orderNum].refunded = _refunded;
    orderAt[_orderNum].settled = _settled;
    emit UpdateOrder(_orderNum, _refunded, _settled);
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

  //useful for workout quickstats screen
  function getPlayer(bytes memory _goalID, uint _stravaID) public view returns(uint, uint, uint, uint, uint){
    return(goalAt[_goalID].playerKms[_stravaID], goalAt[_goalID].playerMins[_stravaID], goalAt[_goalID].playerPayout[_stravaID], goalAt[_goalID].lastLog[_stravaID],profileOf[_stravaID].avatar );
    //goalID, stravaID --> kms0, mins1, reward2, lastLogTime3, avatar4
  }

  //used to generate order list
  function getIndexedOrder(bytes memory _companyID, uint _index) public view returns(string memory, uint, uint, uint, bool, bool){
    return(companyAt[_companyID].indexedOrder[_index].item, companyAt[_companyID].indexedOrder[_index].stravaBuyer, companyAt[_companyID].indexedOrder[_index].price, companyAt[_companyID].indexedOrder[_index].date, companyAt[_companyID].indexedOrder[_index].refunded, companyAt[_companyID].indexedOrder[_index].settled);    
    //companyID, index --> item0, buyerID1, price2, date3, refunded4, settled5
  }

  //used for order search
  function searchOrders(bytes memory _orderNum) public view returns(string memory, uint, uint, uint, bool, bool){
    return(orderAt[_orderNum].item, orderAt[_orderNum].stravaBuyer, orderAt[_orderNum].price, orderAt[_orderNum].date, orderAt[_orderNum].refunded, orderAt[_orderNum].settled );
    //orderNo --> item0, buyerID1, price2, date3, refunded4, settled5
  }


  function getNcenoStats() public view returns(uint, uint, uint, uint, uint, uint, uint){
    return(companyCount, goalCount, kmCount, minsCount, userCount, orderCount, payoutToDate);
  }
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
  constructor(uint _supply, address _owner, string memory _symbol, string memory _name, address _relayHub) public {
    balances[_owner]= _supply;
    thetotalSupply = _supply;
    name = _name;
    decimals = 0;
    symbol = _symbol;
    setRelayHub(IRelayHub(_relayHub));
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
  
  function balanceOf(address _owner) public returns (uint256 balance) {
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
  
  function allowance(address _owner, address _spender) public returns (uint256 remaining) {
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