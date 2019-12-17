pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";

//test data
//stravaID: 39706111
//username: 0x6d6574616d61736b5f6a6e
//flag: 0x7573

//web3.utils.toHex('');
//1000100000000000000*targetStake/ethPrice

//makeProfile: "123456","0x6a61736f6e","0x7573","1"
///////change goalID, maybe timestamp
//host: "0xaaaaaa0000000000000000000000000000","120","10","7","12","1569801600","123456"
//value: 50000000000000000
//log:

//inherit gas station relay contract
//inherit chainlink contracts... but may need to alter RelayRecipient.sol as: RelayRecipient is ChainlinkClient
contract LineDemo is RelayRecipient{
  //contract Nceno is ChainlinkClient{
  //contract Nceno{

  
  event MakeProfile(address indexed _wallet, uint indexed _stravaID, string _userName, string _flag, uint _OS, string _email);
  event Host(bytes indexed _goalID, uint _activeMins,  uint _stakeUSD, uint _sesPerWk, uint _wks, uint indexed _startTime, uint indexed _stravaID, uint _ethPricePennies);
  
  //IRelayHub hub = IRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494); //ropsten, mainnet

  //gas station init
  constructor() public {
    //init_relay_hub(RelayHub(hubAddress));
    setRelayHub(IRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494));
  }

  struct goalObject{
    bytes goalID;
    uint startTime;
    uint activeMins;
    uint wks;
    uint stakeUSD; //stake in usd
    uint sesPerWk;
    //uint ethPricePennies; //this is the usd price of eth, but multiplied by 100. not used

  }
  mapping(bytes => goalObject) goalAt;
  mapping(uint => goalObject) goalInstance;
  uint public goalCount;
  bytes[] public goalIDs;

  struct competitorObject{
    uint stravaID;
    string userName;
    address walletAdr;
    string email;
    uint born;
    string flag;
    uint OS;
    mapping(bytes=>goalObject) myGoal;
    uint myGoalCount;
    mapping(uint=>goalObject) mygoalInstance;
  }
  mapping(uint=>competitorObject) public profileOf;
  uint[] stravaIDs;
  mapping(uint=>bool) public userExists;


  function makeProfile(uint _stravaID, string calldata _userName, string calldata _flag, uint _OS, string calldata _email)  external notHalted{
    require(userExists[_stravaID] == false, "This profile already exists.");
    competitorObject memory createdCompetitor = competitorObject({
        stravaID : _stravaID,
        userName : _userName,
        walletAdr : getSender(),
        born : now,
        flag : _flag,
        OS : _OS,
        email : _email,
        myGoalCount : 0
    });

    //add to registry
    profileOf[_stravaID] = createdCompetitor;
    userExists[_stravaID] = true;
    stravaIDs.push(_stravaID);
    emit MakeProfile(getSender(), _stravaID, _userName, _flag, _OS, _email);
  }

  function host(bytes memory _goalID, uint _activeMins,  uint _stakeUSD, uint _sesPerWk, uint _wks, uint _startTime, uint _stravaID)  public payable notHalted{

    require(userExists[_stravaID]== true, "User does not exist, wallet-user pair does not match, or msg value not enough."); //getSender()
    goalObject memory createdGoal = goalObject({
      //populate parameters
      goalID : _goalID,
      startTime : _startTime,
      activeMins : _activeMins,
      wks : _wks,
      stakeUSD : _stakeUSD,
      sesPerWk : _sesPerWk
    });

    //push goal to registry
    goalAt[_goalID] = createdGoal;
    goalInstance[goalCount] = createdGoal;
    goalCount++;

    //add goal to self's registry
    profileOf[_stravaID].myGoal[_goalID] = createdGoal;
    profileOf[_stravaID].mygoalInstance[profileOf[_stravaID].myGoalCount] = createdGoal;
    profileOf[_stravaID].myGoalCount++;


    emit Host(_goalID, _activeMins, _stakeUSD, _sesPerWk, _wks, _startTime, _stravaID, 0);
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
 
    uint[12][6] partitionChoices = 

    //choice 2
    [[45, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [22, 23, 11, 44, 0, 0, 0, 0, 0, 0, 0, 0], 
    [14, 17, 14, 6, 16, 33, 0, 0, 0, 0, 0, 0], 
    [11, 11, 14, 10, 4, 7, 17, 26, 0, 0, 0, 0], 
    [9, 8, 10, 11, 7, 4, 4, 9, 17, 21, 0, 0], 
    [7, 7, 8, 9, 8, 6, 4, 3, 5, 10, 15, 18]];
 
  address ncenoAdmin = 0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a; //portis mainnet

  function setNcenoAdmin(address _newAdmin) onlyNcenoAdmin external{
    ncenoAdmin = _newAdmin;
  }

  //--------------------------
  //--- /admin functions
  //--------------------------
}