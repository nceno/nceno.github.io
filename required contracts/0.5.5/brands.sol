pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";
import "./ERC20Interface.sol";


contract NcenoBrands is RelayRecipient{

  event MakeUser(address _wallet, uint _stravaID, string _userName);
  event MakeGoal(bytes _goalID, address _owner, bytes _inviteCodeHash);
  event MakeCompany(bytes _companyID, string _name, address owner, string _token);
  event MakeOrder(bytes _companyID, bytes _orderNum, uint _buyer, string _item, uint _price, uint _date);
  event Join(bytes _goalID, uint _stravaID, string _userName, string _inviteCode);
  event Log(bytes _goalID, uint _stravaID, uint _kms, uint _mins, uint _actID);
  event MakeToken(string _symbol, address _address, uint _supply, address _owner, string _company);
  event Refund(bytes _orderNum, uint _buyer, uint _date, uint _amount);
  
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
    string tokenSymbol;
    address BrandToken_Address;
  }
  mapping(bytes=>company) public companyAt;
  mapping(address=>company) public companyOf;
  mapping(bytes=>bool) public companyExists;
  uint companyCount=0;
  uint payoutToDate=0;

  struct goal{
    bool halted;
    bytes inviteCodeHash;
    mapping(string=>bool) codeOk;
    bytes goalID;
    uint start;
    uint dur;
    uint activeMins;
    uint kms;
    uint tokenPot;
    uint potRemaining;
    uint kmTokenRate;
    uint bpmTokenRate;
    address owner;
    uint compCount;
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
    bytes company;
  }
  mapping(bytes=>order) orderAt;
  uint orderCount=0;

  function addInviteCodes(bytes memory _goalID, string[10] memory _codes) public onlyNcenoAdmin{
    for(uint i =0; i<10; i++){
      goalAt[_goalID].codeOk[_codes[i]]==true;
    }
  }
  //---- /objects

  //main functions
  function makeToken(uint _supply, address _owner, string memory _symbol, string memory _companyName) public returns(address){
    BrandToken createdToken = new BrandToken(_supply, _owner, _symbol, _companyName);
    emit MakeToken(_symbol, address(createdToken), _supply, _owner, _companyName);
    return address(createdToken);
  }

  function makeCompany(string memory _name, bytes memory _companyID, string memory _symbol, uint _supply) public{
    company memory createdCompany = company({
      name : _name,
      companyID : _companyID,
      owner: getSender(),
      tokenSymbol: _symbol,
      BrandToken_Address: 0x0000000000000000000000000000000000000000,
      orderCount:0
    });
    companyExists[_companyID] = true;
    companyAt[_companyID] = createdCompany;
    companyCount++;

    //todo: make token (make token separately first before company)
    //ERC20 internal BrandToken = ERC20(BrandToken_Address);

    //todo:set token address

    emit MakeCompany(_companyID, _name, getSender(), _symbol);
  }

  function hostKm(bytes memory _goalID, uint _start, uint _days, uint _kms, uint _pot, uint _rewardRate)public payable{
    goal memory createdGoal = goal({
      halted: false,
      goalID: _goalID,
      start: _start,
      dur: _days,
      activeMins: 0,
      kms: _kms,
      tokenPot: _pot,
      potRemaining: _pot,
      kmTokenRate: _rewardRate,
      bpmTokenRate:0,
      owner: getSender(),
      compCount:0
    });
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;
    goalCount++;

    //todo: transfer tokens here

    emit MakeGoal(_goalID, getSender(), _inviteCodeHash);
  }

  function hostBpm(bytes memory _goalID, uint _start, uint _days, uint _mins, uint _pot, uint _rewardRate) public payable{
    goal memory createdGoal = goal({
      halted: false,
      goalID: _goalID,
      start: _start,
      dur: _days,
      activeMins: _mins,
      kms: 0,
      tokenPot: _pot,
      potRemaining: _pot,
      kmTokenRate:0,
      bpmTokenRate: _rewardRate,
      owner: getSender(),
      compCount:0
    });
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;
    goalCount++;

    //todo: transfer tokens here

    emit MakeGoal(_goalID, getSender(), _inviteCodeHash);
  }

  function join(bytes memory _goalID, uint _stravaID, string memory _userName, string memory _inviteCode) public {
    require(now < goalAt[_goalID].start+goalAt[_goalID].dur 
      && goalAt[_goalID].isPlayer[_stravaID] == false 
      //&& keccak256(_inviteCode) == goalAt[_goalID].inviteCodeHash
      && goalAt[_goalID].halted == false
      && goalAt[_goalID].codeOk[_inviteCode]==true);

    if(userExists[_stravaID] == false){
      player memory createdPlayer = player({
        stravaID : _stravaID,
        userName : _userName,
        wallet : getSender()
      });
      profileOf[_stravaID] = createdPlayer;
      userExists[_stravaID] = true;
      userCount++;
      emit MakeUser(getSender(), _stravaID, _userName);
    }

    goalAt[_goalID].playerSet[0]=_stravaID;
    goalAt[_goalID].indexedPlayerID[goalAt[_goalID].compCount]=_stravaID;
    goalAt[_goalID].playerKms[_stravaID] = 0;
    goalAt[_goalID].playerMins[_stravaID] = 0;
    goalAt[_goalID].isPlayer[_stravaID]=true;
    goalAt[_goalID].compCount++;

    goalAt[_goalID].codeOk[_inviteCode]==false;
    emit Join(_goalID,_stravaID, _userName,  _inviteCode);
  }

  function log(bytes memory _goalID, uint _stravaID, uint _kms, uint _mins, uint _actID, bytes memory _secret) public{
    require(now-goalAt[_goalID].lastLog[_stravaID] >13 hours 
      && now > goalAt[_goalID].start 
      && now < goalAt[_goalID].start+goalAt[_goalID].dur 
      && keccak256(_secret) == keccak256('masterhash')
      && goalAt[_goalID].halted == false
      && goalAt[_goalID].potRemaining>0);
    goalAt[_goalID].playerKms[_stravaID]+= _kms;
    goalAt[_goalID].playerMins[_stravaID]+= _mins;
    uint payout = _kms*goalAt[_goalID].kmTokenRate + _mins*goalAt[_goalID].bpmTokenRate;
    if(goalAt[_goalID].potRemaining<payout){
      payout = goalAt[_goalID].potRemaining;
    }

    //todo: token payout transfer
    //BrandToken.transfer(getSender(), payout);

    goalAt[_goalID].potRemaining-=payout;

    goalAt[_goalID].activitySpent[_actID] = true;
    goalAt[_goalID].lastLog[_stravaID] = now;
    goalAt[_goalID].playerPayout[_stravaID] += payout;
    kmCount+=_kms;
    minsCount+=_mins;
    payoutToDate+=payout;
    emit Log(_goalID, _stravaID, _kms, _mins, _actID);
  }
  
  function buy(bytes memory _goalID, bytes memory _companyID, bytes memory _orderNum, uint _stravaID, string memory _item, uint _price) public{
    require(goalAt[_goalID].halted == false);

    //todo: transfer tokens to owner

    order memory createdOrder = order ({
      orderNum: _orderNum,
      item: _item,
      stravaBuyer: _stravaID,
      price: _price,
      date: now,
      refunded: false,
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

  function refund(bytes memory _goalID, bytes memory _orderNum)public {
    require(goalAt[_goalID].owner == getSender());
    
    //todo: transfer tokens back to buyer

    emit Refund(_orderNum, orderAt[_orderNum].stravaBuyer, now, orderAt[_orderNum].price);
  }

  function halt(bytes memory _goalID, bool _status)public{
    require(goalAt[_goalID].owner == getSender());
    goalAt[_goalID].halted = _status;
  }
  //---- /main functions

  //getters
  function goalParams(bytes memory _goalID) public returns(uint, uint, uint, uint, uint, uint){
    return(goalAt[_goalID].start, goalAt[_goalID].dur, goalAt[_goalID].activeMins, goalAt[_goalID].kms, goalAt[_goalID].compCount, goalAt[_goalID].potRemaining);
  }

  function getIndexedPlayerID(bytes memory _goalID, uint _index) public returns(uint){
    return(goalAt[_goalID].indexedPlayerID[_index]);
  }

  function getPlayer(bytes memory _goalID, uint _stravaID) public returns(uint, uint, uint, uint){
    return(goalAt[_goalID].playerKms[_stravaID], goalAt[_goalID].playerMins[_stravaID], goalAt[_goalID].playerPayout[_stravaID], goalAt[_goalID].lastLog[_stravaID]);
  }

  function getIndexedOrder(bytes memory _companyID, uint _index) public returns(string memory, uint, uint, uint, bool){
    return(companyAt[_companyID].indexedOrder[_index].item, companyAt[_companyID].indexedOrder[_index].stravaBuyer, companyAt[_companyID].indexedOrder[_index].price, companyAt[_companyID].indexedOrder[_index].date, companyAt[_companyID].indexedOrder[_index].refunded);    
  }

  function searchOrders(bytes memory _orderNum) public returns(string memory, uint, uint, uint, bool, bytes memory){
    return(orderAt[_orderNum].item, orderAt[_orderNum].stravaBuyer, orderAt[_orderNum].price, orderAt[_orderNum].date, orderAt[_orderNum].refunded, orderAt[_orderNum].company);
  }

  function getNcenoStats() public returns(uint, uint, uint, uint, uint, uint, uint){
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
contract BrandToken {
  constructor(uint _supply, address _owner, string memory _symbol, string memory _name) public {
    balances[_owner]= _supply;
    thetotalSupply = _supply;
    name = _name;
    decimals = 0;
    symbol = _symbol;
  }

  mapping(address => uint256) balances;
  mapping(address => mapping (address => uint256)) allowed;
  uint public  thetotalSupply;
  string public  name;
  uint8 public  decimals;
  string public  symbol;
  
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  function totalSupply() public returns (uint256 theTotalSupply) {
    return theTotalSupply;
  }
  
  function balanceOf(address _owner) public returns (uint256 balance) {
    return balances[_owner];
  }
  
  function approve(address _spender, uint256 _amount) public returns (bool success) {
    allowed[msg.sender][_spender] = _amount;
    emit Approval(msg.sender, _spender, _amount);
    return true;
  }
  
  function transfer(address _to, uint256 _amount) public returns (bool success) {
    if (balances[msg.sender] >= _amount && _amount > 0 && balances[_to] + _amount > balances[_to]) {
      balances[msg.sender] -= _amount;
      balances[_to] += _amount;
      emit Transfer(msg.sender, _to, _amount);
      return true;
    } else {return false;}
  }
   
  function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {
    if (balances[_from] >= _amount && allowed[_from][msg.sender] >= _amount && _amount > 0 && balances[_to] + _amount > balances[_to]) {
      balances[_from] -= _amount;
      balances[_to] += _amount;
      emit Transfer(_from, _to, _amount);
      return true;
    } else {return false;}
  }
  
  function allowance(address _owner, address _spender) public returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }
}