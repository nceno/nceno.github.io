pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";
import "./ERC20Interface.sol";
import "./KyberNetworkProxy.sol";


contract NcenoBrands is RelayRecipient{
  
  //gas station init
  constructor() public {
    setRelayHub(IRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494));
  }

  uint[12][6] partitionChoices = 
    [[45, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [22, 23, 11, 44, 0, 0, 0, 0, 0, 0, 0, 0], 
    [14, 17, 14, 6, 16, 33, 0, 0, 0, 0, 0, 0], 
    [11, 11, 14, 10, 4, 7, 17, 26, 0, 0, 0, 0], 
    [9, 8, 10, 11, 7, 4, 4, 9, 17, 21, 0, 0], 
    [7, 7, 8, 9, 8, 6, 4, 3, 5, 10, 15, 18]];

  struct goal{
    bytes goalID;
    uint start;
    uint weeks;
    uint costPerLife;
    uint quotaPerWk;
    uint minsPer;    
    
    mapping(uint=>uint)indexedPlayers; //index --> stravaID
      uint playerCt;

    mapping(uint=>mapping(uint=>bool))failuresByWeek; //week => stravaID --> failed?
      mapping(uint=>uint) failureCountByWeek; //week --> how many failed
  }
  mapping(bytes => goal) goalAt;

  struct player{
    address playerAddr;
    uint stravaID;
    bytes userName;
    uint avatar;
    mapping(bytes=>goal) myGoal;
    mapping(uint=>bool)activityID; //can't double spend activity
    mapping(uint=>uint)quotaByWeek; //week --> workoutCount
    uint purse;

  }
  mapping(uint=>player) public profileOf;
  mapping(uint=>bool) public userExists;

  //---- /objects

  //main functions

  function host(bytes memory _goalID, uint _start, uint _weeks, uint _costPerLife, uint _quotaPerWk, uint _minsPer) public payable{
    goal memory createdGoal = goal({
      goalID: _goalID,
      start: _start,
      weeks: _weeks,
      costPerLife: _costPerLife,
      quotaPerWk: _quotaPerWk,
      minsPer: _minsPer
    });   
  }


  function join(bytes memory _goalID, uint _stravaID, bytes memory _userName, uint _avatar) public {
    
  }

  function log(bytes memory _goalID, uint _stravaID, uint _mins, uint _actID, bytes memory _secretHash, uint _secretIndex) public{
    //---- token payout
    ERC20 companyToken = ERC20(goalAt[_goalID].token);
    ncenoToken.transfer(getSender(), payout);
    //----/ token payout
    
  }

  function claim(bytes memory _goalID, uint _stravaID) public{

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