pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";
import "./ERC20Interface.sol";

//inherit gas station relay contract
//inherit chainlink contracts... but may need to alter RelayRecipient.sol as: RelayRecipient is ChainlinkClient
contract Nceno is RelayRecipient{
  //contract Nceno is ChainlinkClient{
  //contract Nceno{

  event MakeProfile(address indexed _wallet, uint indexed _stravaID, bytes _userName, bytes _email);
  event Host(bytes indexed _goalID, uint _activeMins,  uint _stakeUSD, uint _sesPerWk, uint _wks, uint indexed _startTime, uint indexed _stravaID, uint _ethPricePennies);
  event Join(bytes indexed _goalID, uint indexed _stravaID, uint indexed _ethPricePennies);
  event Log(bytes indexed _goalID, uint indexed _stravaID, uint _activityID, uint _avgHR, uint _reportedMins, uint indexed _payout);
  event Buy(bytes _orderNum, string _buyer, string _item, uint _price, uint _date, bool _refunded); 
  

  //gas station init
  constructor() public {
    setRelayHub(IRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494));
  }

  struct goalObject{
    bytes goalID;
    uint startTime;
    uint kms;
    uint rewardRate; //tokens per km
    uint competitorCount;
    uint[10] competitorIDs;

    mapping(uint=>bool) activitySpent;
    mapping(uint=>bool) isCompetitor;
  }
  mapping(bytes => goalObject) goalAt;
  mapping(uint => goalObject) goalInstance;
  uint public goalCount;
  bytes[] public goalIDs;

  struct competitorObject{
    uint stravaID;
    bytes userName;
    address walletAdr;
    bytes email;
    mapping(bytes=>goalObject) myGoal;
    uint myGoalCount;
    mapping(uint=>goalObject) mygoalInstance;
  }
  mapping(uint=>competitorObject) public profileOf;
  uint[] stravaIDs;
  mapping(uint=>bool) public userExists;


  function host(bytes memory _goalID, uint _activeMins, uint _startTime, uint _stravaID, string _key)  public payable notHalted{
    require(userExists[_stravaID]== true && profileOf[_stravaID].walletAdr == getSender() && msg.value >= 100*1000000000000000000*_stakeUSD/(_ethPricePennies),
     "User does not exist, wallet-user pair does not match, or msg value not enough."); //getSender()
    goalObject memory createdGoal = goalObject({
      //populate parameters
      goalID : _goalID,
      startTime : _startTime,
      activeMins : _activeMins,
      wks : _wks,
      stakeUSD : _stakeUSD,
      sesPerWk : _sesPerWk,
        
      competitorCount : 1,
      competitorIDs : [_stravaID, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          
      lockedPercent : partitionChoices[_wks/2 -1],
      potWk : [uint256(0), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      winnersWk : [uint256(0), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      unclaimedStake : _stakeUSD,
      liquidated : false,
      key: _key      
    });

    //push goal to registry
    goalAt[_goalID] = createdGoal;
    goalInstance[goalCount] = createdGoal;
    goalCount++;

    //add goal to self's registry
    profileOf[_stravaID].myGoal[_goalID] = createdGoal;
    profileOf[_stravaID].mygoalInstance[profileOf[_stravaID].myGoalCount] = createdGoal;
    profileOf[_stravaID].myGoalCount++;

    //kyber step... must use correct decimals. DAI has 18, USDC has 6
    execSwap(DAI_ERC20, address(this));

    emit Host(_goalID, _activeMins, _stakeUSD, _sesPerWk, _wks, _startTime, _stravaID, _ethPricePennies);
  }

  function join(bytes calldata _goalID, uint _stravaID, bytes calldata _userName, bytes calldata _email, string _inviteCode)  external payable notHalted {

    require(goalAt[_goalID].isCompetitor[_stravaID] == false && keccak256(_inviteCode) == keccak256(goalAt[_goalID].key));
    
      //add self as competitor
      goalAt[_goalID].competitorIDs[goalAt[_goalID].competitorCount] = _stravaID;
      goalAt[_goalID].competitorCount++;
      goalAt[_goalID].isCompetitor[_stravaID] = true;

      //adjust the unclaimedStake
      goalAt[_goalID].unclaimedStake+= goalAt[_goalID].stakeUSD;

      //add goal to own registry
      profileOf[_stravaID].myGoal[_goalID] = goalAt[_goalID];
      profileOf[_stravaID].mygoalInstance[profileOf[_stravaID].myGoalCount] = goalAt[_goalID];
      profileOf[_stravaID].myGoalCount++;

      emit Join(_goalID, _stravaID, _ethPricePennies);
    

    //create user
    if(userExists[_stravaID] != true){
      competitorObject memory createdCompetitor = competitorObject({
        stravaID : _stravaID,
        userName : _userName,
        walletAdr : getSender(),
        email : _email,
        myGoalCount : 0
      });
      //add to registry
      profileOf[_stravaID] = createdCompetitor;
      userExists[_stravaID] = true;
      stravaIDs.push(_stravaID);
      emit MakeProfile(getSender(), _stravaID, _userName, _email);
    }

    
  }

  function log(bytes calldata _goalID, uint _stravaID, uint _activityID, uint _avgHR, uint _reportedMins)  external notPaused{
    require(profileOf[_stravaID].walletAdr == getSender() && goalAt[_goalID].isCompetitor[_stravaID]==true && 
      (goalAt[_goalID].startTime < now) && (now < goalAt[_goalID].startTime + goalAt[_goalID].wks*1 weeks), 
      "wallet-user mismatch, user is not competitor, goal has not started, or week has already passed"); //getSender()
    uint wk = (now - goalAt[_goalID].startTime)/604800;
    uint payout =0;
    
    //payment logic for activity comparison, HR check, timestamp double spending, and limited payouts per week.. && goalAt[_goalID].activitySpent[_activityID]==false
    if(goalAt[_goalID].activitySpent[_activityID]==false && _reportedMins >= goalAt[_goalID].activeMins && _avgHR >= hrThresh  && goalAt[_goalID].successes[_stravaID][wk]<goalAt[_goalID].sesPerWk){
          
      //TODO: ensure this is correct decimals. not wei or pennies.
      //uint payout = 1000000000000000000*goalAt[_goalID].stakeUSD*goalAt[_goalID].lockedPercent[wk]/(goalAt[_goalID].ethPricePennies*goalAt[_goalID].sesPerWk);
      payout = 1000000000000000000*goalAt[_goalID].stakeUSD*goalAt[_goalID].lockedPercent[wk]/(100*goalAt[_goalID].sesPerWk);
      //getSender().transfer(payout); //ether payout
      
      DAI_ERC20.transfer(getSender(), payout); //stablecoin payout

      //increase winnersWk if this is the final workout of the week
      if(goalAt[_goalID].successes[_stravaID][wk] == goalAt[_goalID].sesPerWk-1){
        goalAt[_goalID].winnersWk[wk]++;
      }

      //note the success     
      goalAt[_goalID].successes[_stravaID][wk]++;

      //protect activity from double spending 
      goalAt[_goalID].activitySpent[_activityID]=true;

      //adjust the unclaimedStake
      goalAt[_goalID].unclaimedStake-= payout; //convert to usd
    }
    //else revert("reported minutes not enough, timestamp already used, or weekly submission quota already met.");
    emit Log(_goalID, _stravaID, _activityID, _avgHR, _reportedMins, payout);
  }

  function buy(string _buyer, string _item, uint _price, bytes _orderNum) public{
    //transfer _price tokens from getSender() to _brandOwner

    emit Buy(_orderNum, _buyer, _item, _price, now, false); 
  }

  //mark as delivered
/*  function refund(bytes _orderNum, bytes _goalID){
    require(goalAt[_goalID].owner == getSender())
    goalAt[_goalID].orders[_orderNum].status = true;
  }*/

  //getters for UI
  //get goal
  function getGoalParams(bytes calldata _goalID) external view returns(uint, uint, uint, uint, uint, uint){
    return(goalAt[_goalID].activeMins, goalAt[_goalID].stakeUSD, goalAt[_goalID].sesPerWk, goalAt[_goalID].wks, goalAt[_goalID].startTime, goalAt[_goalID].competitorCount);
  }

  function getGoalArrays(bytes calldata _goalID, uint _stravaID) external view returns(uint[12] memory, uint[12] memory, uint[12] memory, uint[10] memory, uint[12] memory){
    return(goalAt[_goalID].lockedPercent, goalAt[_goalID].successes[_stravaID], goalAt[_goalID].winnersWk, goalAt[_goalID].competitorIDs, goalAt[_goalID].claims[_stravaID]);
  }





  //get future goal: only returns a goal if it hasn't started yet
  function getFutureGoal(uint _index) external view returns(bytes memory, uint, uint, uint, uint, uint, uint){
    if(now < goalInstance[_index].startTime){
      bytes memory id = goalInstance[_index].goalID;
      return(
        goalInstance[_index].goalID, 
        goalInstance[_index].activeMins, 
        goalInstance[_index].stakeUSD, 
        goalInstance[_index].sesPerWk, 
        goalInstance[_index].wks, 
        goalInstance[_index].startTime, 
        goalAt[id].competitorCount
      );
    }
  }

  function getParticipants(bytes calldata _goalID) external view returns(uint[10] memory, bytes[10] memory, bytes[10] memory, uint){
    uint[10] memory ids;
    bytes[10] memory names;
    bytes[10] memory flags;

    for(uint i =0; i<goalAt[_goalID].competitorCount; i++){
      if(goalAt[_goalID].competitorIDs[i] != 0x0000000000000000000000000000000000000000000000000000000000000000){
        ids[i] = goalAt[_goalID].competitorIDs[i];
        names[i] = profileOf[goalAt[_goalID].competitorIDs[i]].userName;
        flags[i] = profileOf[goalAt[_goalID].competitorIDs[i]].flag;
      }
    }
    return(ids, names, flags, goalAt[_goalID].competitorCount);
  }

  //get personal stats
  struct myStatsObject{
    uint adherenceRate;
    uint[12] wkPayouts;
    uint lostStake;
    uint[12] wkBonuses;
    uint bonusTotal;
    uint totalAtStake;
  }
  function getMyStats(uint _stravaID, string _goalID) returns(string, uint, uint){
    //name, reward, kms, kms/target*100, end-now/day,   
  }
  function 

  function getProfile(uint _stravaID) external view returns(address, uint, bytes memory, uint, uint){
    return(profileOf[_stravaID].walletAdr, profileOf[_stravaID].born , profileOf[_stravaID].flag , profileOf[_stravaID].OS , profileOf[_stravaID].myGoalCount);
  }

  function getMyGoalInstance(uint _stravaID, uint _instance) external view returns(bytes memory){
    return(profileOf[_stravaID].mygoalInstance[_instance].goalID);
  }

  //-----------------------------------------------
  //gas station relay stuff
  //-----------------------------------------------
  
  //replaced all getSender() with getSender()

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

  //-----------------------------------------------
  //---  /gas station relay stuff
  //-----------------------------------------------

  //--------------------------
  //--- admin functions
  //--------------------------

  modifier onlyNcenoAdmin(){
    require(getSender() == ncenoAdmin,"Sender not authorized."); //getSender()
    _;
  }
  
  //stuff to halt the app
  bool halted =false;
  modifier notHalted(){
    require(halted == false,"App is halted."); //getSender()
    _;
  }

  bool paused = false;
  modifier notPaused(){
    require(paused == false,"App is paused."); //getSender()
    _;
  }

  function getAppStatus() external view returns(bool, bool){
    return(halted, paused);
  }

  //halt is stronger than pause
  function setHalt(bool _haltstatus, bool _pausestatus) onlyNcenoAdmin external {
    halted = _haltstatus;
    paused = _pausestatus;
  }

  //useful for liquidating
  function getGoalCount() external view returns(uint){
    return(goalCount);
  }

  function getUserCount() external view returns(uint){
    return(stravaIDs.length);
  }

  address ncenoAdmin = 0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a; //portis mainnet

  function setNcenoAdmin(address _newAdmin) onlyNcenoAdmin external{
    ncenoAdmin = _newAdmin;
  }
  //--------------------------
  //--- /admin functions
  //--------------------------
}