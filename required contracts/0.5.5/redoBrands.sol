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

  event MakeUser(address indexed _wallet, uint indexed _stravaID, bytes _userName, bytes _email);
  event MakeGoal();
  event MakeCompany();
  event MakeOrder(bytes _orderNum, string _buyer, string _item, uint _price, uint _date);
  event Join();
  event Log();
  event MakeToken();
  

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
    string token;
  }
  mapping(bytes=>company) public companyAt;
  mapping(address=>company) public companyOf;
  mapping(bytes=>bool) public companyExists;

  struct goal{
    bool halted=false;
    string inviteCode;
    bytes goalID;
    uint start;
    uint days;
    uint activeMins;
    uint kms;
    uint tokenPot;
    uint kmTokenRate;
    uint bpmTokenRate;
    string company;
    uint compCount=0;
    mapping(uint=>uint) playerSet;
    mapping(bytes=>order) orderSet;
    mapping(uint=>uint) playerKms;
    mapping(uint=>uint) playerMins;

    mapping(uint=>bool) activitySpent;
    mapping(uint=>bool) isPlayer;
  }
  mapping(bytes => goal) goalAt;

  struct player{
    address wallet;
    uint stravaID;
    string userName;
    mapping(bytes=>order) orderSet;
    mapping(bytes=>goal) goalSet;
  }
  mapping(uint=>player) public profileOf;
  mapping(uint=>bool) public userExists;

  struct order{
    bytes orderNum;
    string item;
    uint stravaBuyer;
    uint price;
    uint date;
    bool filled;
    string company;
  }
  mapping(bytes=>order) orderAt;
  //---- /objects

  //main functions
  function makeCompany(string _name, bytes _companyID, string _symbol, uint _supply) public{
    company memory createdCompany = company({
      name : _name,
      companyID : _companyID,
      owner: getSender(),
      token: _symbol
    });
    companyExists[_companyID] = true;
    companyAt[_companyID] = createdCompany;

    //todo: make token

    emit makeCompany();
    emit MakeToken();
  }

  function hostKm(byted _goalID, uint _start, uint _days, uint _kms, uint _pot, uint _rewardRate, string _inviteCode){
    goal memory createdGoal = goal({
      inviteCode: _inviteCode,
      goalID: _goalID,
      start: _start,
      days: _days,
      kms: _kms,
      tokenPot: _pot,
      kmTokenRate: _rewardRate,
      company: companyOf[getSender()]
    });
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;

    //todo: transfer tokens here

    emit MakeGoal();
  }

  function hostBpm(byted _goalID, uint _start, uint _days, uint _mins, uint _pot, uint _rewardRate, string _inviteCode){
    goal memory createdGoal = goal({
      inviteCode: _inviteCode,
      goalID: _goalID,
      start: _start,
      days: _days,
      activeMins: _mins,
      tokenPot: _pot,
      bpmTokenRate: _rewardRate,
      company: companyOf[getSender()]
    });
    companyOf[getSender()].goalSet[_goalID] = createdGoal;
    goalAt[_goalID] = createdGoal;

    //todo: transfer tokens here

    emit MakeGoal();
  }

  function join(bytes _goalID, uint _stravaID, string _userName, string _inviteCode){
    require(goalAt[_goalID].isPlayer[_stravaID] == false && keccak256(_inviteCode) == keccak256(goalAt[_goalID].inviteCode));

    goalAt[_goalID].playerSet[0]=_stravaID;
    goalAt[_goalID].playerKms[_stravaID] = 0;
    goalAt[_goalID].playerMins[_stravaID] = 0;
    goalAt[_goalID].isPlayer[_stravaID]=true;
    goalAt[_goalID].compCount++;

    emit Join();
    emit MakeUser();
  }

  function log(bytes _secret){
    require(keccak256(_secret) == keccak256());

  }
  
  function buy(){

    emit MakeOrder();
  }

  function halt(bytes _goalID, bool _status){
    goalAt[_goalID].halted = _status;
  }

  function discrBonus(){

  }
  //---- /main functions

  //getters
  function goalParams() public returns(){

  }

  function myGoalStats() public returns(){

  }

  function getPlayer() public returns(){

  }

  function getRecentOrders() public returns(){

  }

  function searchOrders() public returns(){

  }
  //----- /getters

  //modifiers
  modifier notHalted(){
    require(halted == false,"App is halted.");
    _;
  }
}

// factory stuff
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
//----- /factory stuff