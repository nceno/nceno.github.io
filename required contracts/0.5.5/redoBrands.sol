pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";
import "./ERC20Interface.sol";
import "./ERC20Burnable.sol";
import "./ERC20Mintable.sol";

//inherit gas station relay contract
//inherit chainlink contracts... but may need to alter RelayRecipient.sol as: RelayRecipient is ChainlinkClient
contract NcenoBrands is RelayRecipient{
  //contract Nceno is ChainlinkClient{
  //contract Nceno{

  event MakeUser(address _wallet, uint _stravaID, string _userName);
  event MakeGoal(bytes _goalID, address _owner, bytes _inviteCodeHash);
  event MakeCompany(bytes _companyID, string _name, address owner, string _token);
  event MakeOrder(bytes _companyID, bytes _orderNum, string _buyer, string _item, uint _price, uint _date);
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
    uint orderCount=0;
    mapping(uint=>order) indexedOrder;
    string tokenSymbol;
    address tokenAddress;
  }
  mapping(bytes=>company) public companyAt;
  mapping(address=>company) public companyOf;
  mapping(bytes=>bool) public companyExists;
  uint companyCount=0;
  uint payoutToDate=0;

  struct goal{
    bool halted=false;
    bytes inviteCodeHash;
    mapping(string=>bool) codeOk;
    bytes goalID;
    uint start;
    uint days;
    uint activeMins;
    uint kms;
    uint tokenPot;
    uint potRemaining;
    uint kmTokenRate;
    uint bpmTokenRate;
    address owner;
    uint compCount=0;
    mapping(uint=>uint) playerSet;
    mapping(uint=>player) indexedPlayer
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

  function addInviteCodes(bytes _goalID, string[10] _codes) public onlyNcenoAdmin{
    for(uint i =0; i<10; i++){
      goalAd[_goalID].codeOk[_codes[i]]==true;
    }
  }
  //---- /objects

  //main functions
  function makeCompany(string _name, bytes _companyID, string _symbol, uint _supply) public{
    company memory createdCompany = company({
      name : _name,
      companyID : _companyID,
      owner: getSender(),
      tokenSymbol: _symbol
    });
    companyExists[_companyID] = true;
    companyAt[_companyID] = createdCompany;
    companyCount++;

    //todo: make token

    emit makeCompany(_companyID, _name, getSender(), _symbol);
    emit MakeToken(_symbol, _address, _supply, getSender(), _company);
  }

  function hostKm(byted _goalID, uint _start, uint _days, uint _kms, uint _pot, uint _rewardRate, bytes _inviteCodeHash)public payable{
    goal memory createdGoal = goal({
      inviteCode: _inviteCode,
      goalID: _goalID,
      start: _start,
      days: _days,
      kms: _kms,
      tokenPot: _pot,
      kmTokenRate: _rewardRate,
      owner: getSender()
    });
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;
    goalCount++;

    //todo: transfer tokens here

    emit MakeGoal(_goalID, getSender(), _inviteCodeHash);
  }

  function hostBpm(byted _goalID, uint _start, uint _days, uint _mins, uint _pot, uint _rewardRate, bytes _inviteCodeHash) public payable{
    goal memory createdGoal = goal({
      inviteCode: _inviteCode,
      goalID: _goalID,
      start: _start,
      days: _days,
      activeMins: _mins,
      tokenPot: _pot,
      bpmTokenRate: _rewardRate,
      owner: getSender()
    });
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;
    goalCount++;

    //todo: transfer tokens here

    emit MakeGoal(_goalID, getSender(), _inviteCodeHash);
  }

  function join(bytes _goalID, uint _stravaID, string _userName, string _inviteCode) public {
    require(now < goalAt[_goalID].start+goalAt[_goalID].days 
      && goalAt[_goalID].isPlayer[_stravaID] == false 
      && keccak256(_inviteCode) == goalAt[_goalID].inviteCodeHash
      && goalAt[_goalID].halted == false
      && goalAd[_goalID].codeOk[_code]==true);

    if(userExists[_stravaID] == false){
      player memory createdPlayer = player({
        stravaID : _stravaID,
        userName : _userName,
        walletAdr : getSender()
      });
      profileOf[_stravaID] = createdPlayer;
      userExists[_stravaID] = true;
      userCount++;
      emit MakeUser(_wallet, _stravaID, _userName);
    }

    goalAt[_goalID].playerSet[0]=_stravaID;
    goalAt[_goalID].playerKms[_stravaID] = 0;
    goalAt[_goalID].playerMins[_stravaID] = 0;
    goalAt[_goalID].isPlayer[_stravaID]=true;
    goalAt[_goalID].compCount++;

    goalAd[_goalID].codeOk[_code]==false;
    emit Join(_goalID,_stravaID, _userName,  _inviteCode);
  }

  function log(bytes _goalID, uint _stravaID, uint _kms, uint _mins, uint _actID, bytes _secret) public{
    require(now-goalAt[_goalID].lastLog[_stravaID] >13 hours 
      && now > goalAt[_goalID].start 
      && now < goalAt[_goalID].start+goalAt[_goalID].days 
      && keccak256(_secret) == keccak256(?)
      && goalAt[_goalID].halted == false
      && goalAt[_goalID].potRemaining>0);
    goalAt[_goalID].playerKms[]+= _kms;
    goalAt[_goalID].playerMins[]+= _mins;
    uint memory payout = _kms*goalAt[_goalID].kmTokenRate + _mins*goalAt[_goalID].bpmTokenRate;
    if(goalAt[_goalID].potRemaining<payout){
      payout = goalAt[_goalID].potRemaining;
    }

    //todo: token payout transfer

    goalAt[_goalID].potRemaining-=payout;

    goalAt[_goalID].activitySpent[_actID] = true;
    goalAt[_goalID].lastLog[_stravaID] = now;
    goalAt[_goalID].playerPayout += payout;
    kmCount+=_kms;
    minsCount+=_mins;
    payoutToDate+=payout;
    emit Log(_goalID, _stravaID, _kms, _mins, _actID);

  }
  
  function buy(bytes _companyID, bytes _orderNum, uint _buyer, string _item, uint _price){
    require(goalAt[_goalID].halted == false);

    //todo: transfer tokens to owner

    order memory createdOrder =({
      orderNum: _orderNum,
      item: _item,
      stravaBuyer: _buyer,
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
    
    emit MakeOrder(_companyID, _orderNum, _buyer, _item, _price, now);
  }

  function refund(bytes _orderNum){
    require(goalAt[_goalID].owner == getSender())
    
    //todo: transfer tokens back to buyer

    emit Refund(_orderNum, _buyer, now, _amount);
  }

  function halt(bytes _goalID, bool _status)public{
    require(goalAt[_goalID].owner = getSender());
    goalAt[_goalID].halted = _status;
  }
  //---- /main functions

  //getters
  function goalParams(bytes _goalID) public returns(uint, uint, uint, uint, uint, uint){
    return(start, days, activeMins, kms, compCount, potRemaining);
  }

  function getIndexedPlayer(bytes _goalID, uint _index) public returns(uint){
    return(goalAt[_goalID].indexedPlayer[_index]);
  }

  function getIndexedPlayer(bytes _goalID, uint _stravaID) public returns(uint, uint, uint, uint){
    return(goalAt[_goalID].playerKms[_stravaID], goalAt[_goalID].playerMins[_stravaID], goalAt[_goalID].platerPayout[_stravaID], goalAt[_goalID].lastLog[_stravaID]);
  }

  function getIndexedOrder(bytes _companyID, uint _index) public returns(string, uint, uint, uint, bool){
    return(companyAt[_companyID].indexedOrder[_index].item, companyAt[_companyID].indexedOrder[_index].stravaBuyer, companyAt[_companyID].indexedOrder[_index].price, companyAt[_companyID].indexedOrder[_index].date, companyAt[_companyID].indexedOrder[_index].refunded);    
  }

  function searchOrders(bytes _orderNum) public returns(string, uint, uint, uint, bool, bytes){
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
contract MyContract is ERC20Mintable, ERC20Burnable {
  using SafeMath for uint256;
  address[] public tokens;
  constructor(address[] memory _tokens) public {
      tokens = _tokens;
  }
  function testBurn(address account, uint amount) public {
      _burn(account, amount);
  }
  function getTokens() public view returns(address[] memory) {
      return tokens;
  }
}
contract MyFactory {
  function newMyContract() public returns(address)
  {
    MyContract myContract = new MyContract(new address[](0));
    return address(myContract);
  }
}
//----- /token factory stuff