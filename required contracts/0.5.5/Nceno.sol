pragma solidity >=0.5.5;
pragma experimental ABIEncoderV2;
import "./GsnUtils.sol";
import "./IRelayHub.sol";
import "./RelayRecipient.sol";

import "./ERC20Interface.sol";
import "./KyberNetworkProxy.sol";
//import "./ChainlinkClient.sol";


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

//Ropsten chainlink addresses:
/*  
  LINK Token address: 0x20fE562d797A42Dcb3399062AE9546cd06f63280
  Oracle address: 0xc99B3D447826532722E41bc36e644ba3479E4365
  Bool JobID: 7702e2f2f6c24538b00d43c55d59b53a
  bytes JobID: a904aa9d273a4e87870912e563da3b7a
  Uint256 JobID: 44403ffe2c424f738eb6a8206134e298
*/


//inherit gas station relay contract
//inherit chainlink contracts... but may need to alter RelayRecipient.sol as: RelayRecipient is ChainlinkClient
contract Nceno is RelayRecipient{
  //contract Nceno is ChainlinkClient{
  //contract Nceno{

  event LiquidateInstance(uint indexed _unclaimed);
  event LiquidatedAt(uint indexed _unclaimed);
  event MakeProfile(address indexed _wallet, uint indexed _stravaID, bytes _userName, bytes _flag, uint _OS, bytes _email);
  event Host(bytes indexed _goalID, uint _activeMins,  uint _stakeUSD, uint _sesPerWk, uint _wks, uint indexed _startTime, uint indexed _stravaID, uint _ethPricePennies);
  event Join(bytes indexed _goalID, uint indexed _stravaID, uint indexed _ethPricePennies);
  
  event Log(bytes indexed _goalID, uint indexed _stravaID, uint _activityID, uint _avgHR, uint _reportedMins, uint indexed _payout);
  event Claim(bytes indexed _goalID, uint indexed _stravaID, uint indexed _cut);

  //IRelayHub hub = IRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494); //ropsten, mainnet

  //gas station init
  //Link init.... add this argument: address _link
  //function Nceno(address _link) public {
  constructor() public {
    //init_relay_hub(RelayHub(hubAddress));
    setRelayHub(IRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494));


    // Set the address for the LINK token for the network.
    /*if(_link == address(0)) {
      // Useful for deploying to public networks.
      setPublicChainlinkToken();
    } else {
      // Useful if you're deploying to a local network.
      setChainlinkToken(_link);
    }*/
  }

  struct goalObject{
    bytes goalID;
    uint startTime;
    uint activeMins;
    uint wks;
    uint stakeUSD; //stake in usd
    uint sesPerWk;
    //uint ethPricePennies; //this is the usd price of eth, but multiplied by 100. not used

    uint competitorCount;
    uint[10] competitorIDs;

    uint[12] lockedPercent;
    uint[12] potWk;
    uint[12] winnersWk;
    uint unclaimedStake; //gets adjusted by join(), host(), log(), and claim()
    bool liquidated;

    mapping(uint=>uint[12]) successes;
    mapping(uint=>uint[12]) claims;
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
    uint born;
    bytes flag;
    uint OS;
    mapping(bytes=>goalObject) myGoal;
    uint myGoalCount;
    mapping(uint=>goalObject) mygoalInstance;
  }
  mapping(uint=>competitorObject) public profileOf;
  uint[] stravaIDs;
  mapping(uint=>bool) public userExists;


  function makeProfile(uint _stravaID, bytes calldata _userName, bytes calldata _flag, uint _OS, bytes calldata _email)  external notHalted{
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
    //price eth internally using Kyber
    uint _ETHUSDprice;
    (_ETHUSDprice,) = proxy.getExpectedRate(ETH_ERC20, DAI_ERC20, msg.value);
    uint _ethPricePennies = _ETHUSDprice/10**16;

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
      liquidated : false      
    });
     
    
    goalAt[_goalID].isCompetitor[_stravaID] = true;

    //push goal to registry
    goalAt[_goalID] = createdGoal;
    goalInstance[goalCount] = createdGoal;
    goalCount++;

    //add goal to self's registry
    profileOf[_stravaID].myGoal[_goalID] = createdGoal;
    profileOf[_stravaID].mygoalInstance[profileOf[_stravaID].myGoalCount] = createdGoal;
    profileOf[_stravaID].myGoalCount++;

    //referal code
    /*
    if(keccak256(_code) == keccak256(promoCode) && _stakeUSD>50 && _sesPerWk>2 && _wks>3){
      promoCodeCount++;
    }
    */

    //kyber step... must use correct decimals. DAI has 18, USDC has 6
    //executeSwap(ETH_ERC20, msg.value, DAI_ERC20, this, _stakeUSD*(10**18) );
    execSwap(DAI_ERC20, address(this));

    emit Host(_goalID, _activeMins, _stakeUSD, _sesPerWk, _wks, _startTime, _stravaID, _ethPricePennies);
  }
  //event Hosted();

  function join(bytes calldata _goalID, uint _stravaID)  external payable notHalted {
    //price eth internally using Kyber
    uint _ETHUSDprice;
    (_ETHUSDprice,) = proxy.getExpectedRate(ETH_ERC20, DAI_ERC20, msg.value);
    uint _ethPricePennies = _ETHUSDprice/10**16;

    require(userExists[_stravaID]== true && profileOf[_stravaID].walletAdr == getSender() && now < goalAt[_goalID].startTime && msg.value >= 100*1000000000000000000*goalAt[_goalID].stakeUSD/(_ethPricePennies) && goalAt[_goalID].isCompetitor[_stravaID] == false, "Challenge already started, user already is a participant, or else message value is less than intended stake.");
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

    //referal code
    /*
    if(keccak256(_code) == keccak256(promoCode) && goalAt[_goalID].stakeUSD>50 && goalAt[_goalID].sesPerWk>2 && goalAt[_goalID].wks>3){
      promoCodeCount++;
    }
    */

    //kyber step
    //executeSwap(ETH_ERC20, msg.value, DAI_ERC20, this, goalAt[_goalID].stakeUSD );
    execSwap(DAI_ERC20, address(this));
    emit Join(_goalID, _stravaID, _ethPricePennies);
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


  function claim(bytes calldata _goalID, uint _stravaID)  external notPaused{
    //must have 100% adherence for the previous week, and can only claim once.
    require(profileOf[_stravaID].walletAdr == getSender() && goalAt[_goalID].isCompetitor[_stravaID]==true &&  
      goalAt[_goalID].successes[_stravaID][(now-goalAt[_goalID].startTime)/604800-1]==goalAt[_goalID].sesPerWk && 
      goalAt[_goalID].claims[_stravaID][(now-goalAt[_goalID].startTime)/604800-1] == 0,
      "wallet-user mismatch, user not a competitor, user not 100% adherent for the week, or user already claimed bonus for the week."
    ); //getSender()

    //uint winners;
    uint cut;
    uint pot;
    uint logs;
    uint payout = 1000000000000000000*goalAt[_goalID].lockedPercent[(now-goalAt[_goalID].startTime)/604800-1]*goalAt[_goalID].stakeUSD/(100*goalAt[_goalID].sesPerWk);
    //loop over everyone's weekly logs and increase the week's pot from when someone skipped a workout
    for(uint i =0; i<10; i++){
    if(goalAt[_goalID].competitorIDs[i] != 0x0000000000000000000000000000000000000000000000000000000000000000){
        //pot equals total weekly sessions minus total logs, all times payout
        logs+= goalAt[_goalID].successes[goalAt[_goalID].competitorIDs[i]][(now-goalAt[_goalID].startTime)/604800-1];
        //keep track of the number of winners, those with 100% adherence, in the previous week. 
        /*if(goalAt[_goalID].successes[goalAt[_goalID].competitorIDs[i]][(now-goalAt[_goalID].startTime)/604800-1]==goalAt[_goalID].sesPerWk){
          winners++; //TODO: could decrease gas by just referencing winnersWk[]...done
        }*/

      }
    }
    pot = payout*(goalAt[_goalID].competitorCount*goalAt[_goalID].sesPerWk - logs);
    goalAt[_goalID].potWk[(now-goalAt[_goalID].startTime)/604800-1] = pot; //write to the global goal stats

    //TODO: ensure this is in correct decimals, not Wei. 
    //and indexed as previous week...
    //the big 1000.... is supposed to fix the chart scale problem since payout is in cents, and this *was* in 1000000...
    //if it doesnt fix it, try more or less 0's
    cut = pot/(2*goalAt[_goalID].winnersWk[(now-goalAt[_goalID].startTime)/604800-1]); //2* should be replaced by a loss rate
    
    //protect against bonus double spending
    goalAt[_goalID].claims[_stravaID][(now-goalAt[_goalID].startTime)/604800-1] = 1;

    //getSender().transfer(cut); //ether payout
    
    DAI_ERC20.transfer(getSender(), cut); //stablecoin payout

    //adjust the unclaimedStake
    goalAt[_goalID].unclaimedStake-= cut; //convert to usd

    emit Claim(_goalID, _stravaID, cut);
  }

  //----------------------
  //---ChainLink functions------
  //----------------------
/*  function getActivities(address _oracle, bytes _jobId, string _accessToken) public {
    Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfillID.selector); //fulfillID must match one of the below's
    req.add("access_token", _accessToken);
    req.addUint("before", now);
    req.addUint("after", now - 7 days); //
    
    req.add("copyPath", "0.id");
    req.add("copyPath", "0.elapsed_time");
    req.add("copyPath", "0.average_heartrate");

    req.add("copyPath", "1.id");
    req.add("copyPath", "1.elapsed_time");
    req.add("copyPath", "1.average_heartrate");

    req.add("copyPath", "2.id");
    req.add("copyPath", "2.elapsed_time");
    req.add("copyPath", "2.average_heartrate");
    sendChainlinkRequestTo(_oracle, req, oraclePayment); //oraclePayment = 1*LINK
  }


  //fulfillment functions called with response data
  function fulfillID(uint _stravaID, bytes _requestId, uint256 _data) public recordChainlinkFulfillment(_requestId){
    profileOf[_stravaID].CL_id = _data;
  }

  function fulfillTime(uint _stravaID, bytes _requestId, uint256 _data) public recordChainlinkFulfillment(_requestId){
    profileOf[_stravaID].CL_elapsed_time = _data;
  }

  function fulfillHR(uint _stravaID, bytes _requestId, uint256 _data) public recordChainlinkFulfillment(_requestId){
    profileOf[_stravaID].CL_average_heartrate = _data;
  }*/

  //----------------------
  //---  /ChainLink functions------
  //----------------------


  //getters for UI
  //get goal
  function getGoalParams(bytes calldata _goalID) external view returns(uint, uint, uint, uint, uint, uint){
    return(goalAt[_goalID].activeMins, goalAt[_goalID].stakeUSD, goalAt[_goalID].sesPerWk, goalAt[_goalID].wks, goalAt[_goalID].startTime, goalAt[_goalID].competitorCount);
  }

  function getGoalArrays(bytes calldata _goalID, uint _stravaID) external view returns(uint[12] memory, uint[12] memory, uint[12] memory, uint[10] memory, uint[12] memory){
    return(goalAt[_goalID].lockedPercent, goalAt[_goalID].successes[_stravaID], goalAt[_goalID].winnersWk, goalAt[_goalID].competitorIDs, goalAt[_goalID].claims[_stravaID]);
  }

  function getSuccessesClaims(bytes calldata _goalID, uint _stravaID) external view returns(uint[12] memory, uint[12] memory){
    return(goalAt[_goalID].successes[_stravaID], goalAt[_goalID].claims[_stravaID]);
  }

  //called when a user logs a workout. returns the percent earned per workout, and the amount $ earned per workout
  function getGoalPartitions(bytes calldata _goalID) external view returns (uint, uint){
    uint wk = (now - goalAt[_goalID].startTime)/604800;
    return(goalAt[_goalID].lockedPercent[wk-1]/goalAt[_goalID].sesPerWk, goalAt[_goalID].stakeUSD*goalAt[_goalID].lockedPercent[wk-1]*100/goalAt[_goalID].sesPerWk);
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

    //goalObject memory theGoal = goalAt[_goalID];
    //uint compcount = goalAt[_goalID].competitorCount;
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
 
  function getMyGoalStats1(uint _stravaID, bytes calldata _goalID) external view returns(uint, uint, uint){
    //goalObject memory theGoal = goalAt[_goalID];
    uint wk = 1+(now - goalAt[_goalID].startTime)/604800;
    
      myStatsObject memory my;
      my.adherenceRate=0;
      my.totalAtStake=0;
      uint successCount=0;
      
    if(wk>=1 && wk<goalAt[_goalID].wks+1){
      for(uint i =0; i<wk; i++){
        successCount += goalAt[_goalID].successes[_stravaID][i];
      }
      my.adherenceRate = 100*successCount/(wk*goalAt[_goalID].sesPerWk); 
      
      for(uint p=wk; p<goalAt[_goalID].wks; p++){
        my.totalAtStake += goalAt[_goalID].lockedPercent[p]*goalAt[_goalID].stakeUSD*goalAt[_goalID].competitorCount/100;
      }
    }
    //this might get rid of the 0% success post-challenge bug
    else if(wk>goalAt[_goalID].wks){
      for(uint k =0; k<goalAt[_goalID].wks; k++){
        successCount += goalAt[_goalID].successes[_stravaID][k];
      }
      my.adherenceRate = 100*successCount/(goalAt[_goalID].wks*goalAt[_goalID].sesPerWk);
    }
    
    return(my.adherenceRate, my.totalAtStake, successCount);
  }
 
  function getMyGoalStats2(uint _stravaID, bytes calldata _goalID) external view returns(uint[12] memory, uint , uint[12] memory, uint, uint){
    //goalObject memory theGoal = goalAt[_goalID];
    //uint wk = (now - theGoal.startTime)/604800;

    //catches completed goals
    uint wkLimit;
    if((now - goalAt[_goalID].startTime)/604800<goalAt[_goalID].wks+1){
      wkLimit = 1+(now - goalAt[_goalID].startTime)/604800; //active
    }else wkLimit = goalAt[_goalID].wks; //completed
    
    myStatsObject memory my;
      my.lostStake = 0;
      my.bonusTotal = 0;
      uint totalPay=0;

      for(uint j =0; j<wkLimit; j++){

        my.wkPayouts[j] = goalAt[_goalID].lockedPercent[j]*goalAt[_goalID].successes[_stravaID][j]*goalAt[_goalID].stakeUSD/goalAt[_goalID].sesPerWk; //in pennies

        if(goalAt[_goalID].winnersWk[j]>0){
          my.wkBonuses[j] = goalAt[_goalID].claims[_stravaID][j]*goalAt[_goalID].potWk[j]/(goalAt[_goalID].winnersWk[j]*2);
          my.bonusTotal+= my.wkBonuses[j];
        }

        totalPay+= my.wkPayouts[j]; //in pennies

        if(j<(now - goalAt[_goalID].startTime)/604800){
          my.lostStake+=(goalAt[_goalID].lockedPercent[j]*goalAt[_goalID].stakeUSD-my.wkPayouts[j]); //in pennies
        }
      }
     
    return(my.wkPayouts, my.lostStake, my.wkBonuses, my.bonusTotal, totalPay); //result[0], result[1], result[4] wkPayouts,lostStake,totalPay should be /100 in JS
  }


  //get upcoming goal: only returns a user's goal if it hasn't yet started
  function getUpcomingGoal(uint _stravaID, uint _index) external view returns(bytes memory){
    require(now < profileOf[_stravaID].mygoalInstance[_index].startTime );
    return(profileOf[_stravaID].mygoalInstance[_index].goalID);    
  }

  //get active goal: only returns a user's goal if it has already started
  function getActiveGoal(uint _stravaID, uint _index) external view returns(bytes memory){
    require((0 < now - profileOf[_stravaID].mygoalInstance[_index].startTime) && (now-profileOf[_stravaID].mygoalInstance[_index].startTime < profileOf[_stravaID].mygoalInstance[_index].wks*604800));
    return(profileOf[_stravaID].mygoalInstance[_index].goalID);    
  }

  //get completed goal: only returns a user's goal if it has completed
  function getCompletedGoal(uint _stravaID, uint _index) external view returns(bytes memory){
    require(now > profileOf[_stravaID].mygoalInstance[_index].startTime + profileOf[_stravaID].mygoalInstance[_index].wks*604800);
    return(profileOf[_stravaID].mygoalInstance[_index].goalID);
  }

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

  //-----------------------
  //kyber stuff
  //-----------------------

  //must have default payable since this contract expected to receive change
  //function() external payable {}

  address DAI_ERC20_address_ropsten = 0xaD6D458402F60fD3Bd25163575031ACDce07538D;//ropsten
  address DAI_ERC20_address_main = 0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359; //mainnet 
  address ETH_ERC20_Address = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
  address KyberNetworkProxy_Address = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755; //ropsten, mainnet

  
  ERC20 internal ETH_ERC20 = ERC20(ETH_ERC20_Address); //kyber ether proxy

  //ERC20 internal DAI_ERC20 = ERC20(DAI_ERC20_address_ropsten);
  ERC20 internal DAI_ERC20 = ERC20(DAI_ERC20_address_main);
  
  event Swap(address indexed sender, ERC20 destToken, uint amount);
  KyberNetworkProxy public proxy = KyberNetworkProxy(KyberNetworkProxy_Address);

  function execSwap(ERC20 token, address destAddress) public payable {
      uint minConversionRate;
      (minConversionRate,) = proxy.getExpectedRate(ETH_ERC20, token, msg.value);
      uint destAmount = proxy.swapEtherToToken.value(msg.value)(token, minConversionRate);
      require(token.transfer(destAddress, destAmount));
      emit Swap(getSender(), token, destAmount);
  } 

  //--------------------------
  //--- /kyber stuff 
  //--------------------------


  //--------------------------
  //--- admin functions
  //--------------------------

  //admin-defined cash out
  function cashout(uint _dollars) public onlyNcenoAdmin notHalted notPaused{
      DAI_ERC20.transfer(ncenoAdmin, _dollars*1000000000000000000);
  }

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
  function setHalt(bool _status) onlyNcenoAdmin external {
    halted = _status;
    paused = _status;
  }

  function setPause(bool _status) onlyNcenoAdmin external {
    halted = _status;
    paused = _status;
  }

  //cashout a goal slot (useful for iterating)
  function liquidateGoalInstance(uint _index) onlyNcenoAdmin external{
  //can only call one week after a goal is finished
  require(goalInstance[_index].liquidated == false && now > goalInstance[_index].startTime + (goalInstance[_index].wks+1)*604800, "Goal already liquidated, or Goal has not finished yet.");
  //transfer the money
  DAI_ERC20.transfer(ncenoAdmin, goalInstance[_index].unclaimedStake);
  //close the goal
  goalInstance[_index].liquidated = true;

  emit LiquidateInstance(goalInstance[_index].unclaimedStake);

  }

  //cashout a specific goal
  function liquidateGoalAt(bytes calldata _goalID) onlyNcenoAdmin external {
    //can only call one week after a goal is finished
    require(goalAt[_goalID].liquidated == false && now > goalAt[_goalID].startTime + (goalAt[_goalID].wks+1)*604800, "Goal already liquidated, or Goal has not finished yet.");
    //transfer the money
    DAI_ERC20.transfer(ncenoAdmin, goalAt[_goalID].unclaimedStake);
    //close the goal
    goalAt[_goalID].liquidated = true;
    
    emit LiquidatedAt(goalAt[_goalID].unclaimedStake);
  }

  //useful for liquidating
  function getGoalCount() external view returns(uint){
    return(goalCount);
  }

  function getUserCount() external view returns(uint){
    return(stravaIDs.length);
  }

  //payout lockedPercent based on wks parameter
  //uint[12][6] lockedPercent = partitionChoices;
  //uint[12][6][2] partitionChoices =[
    uint[12][6] partitionChoices = 
    //choice 1
    /*[[43, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [13, 30, 21, 36, 0, 0, 0, 0, 0, 0, 0, 0], 
    [7, 12, 24, 13, 26, 18, 0, 0, 0, 0, 0, 0], 
    [3, 10, 9, 21, 12, 10, 24, 11, 0, 0, 0, 0], 
    [2, 7, 7, 9, 18, 11, 4, 17, 16, 9, 0, 0], 
    [2, 5, 7, 5, 9, 15, 10, 3, 8, 18, 11, 7]],*/
    //choice 2
    [[45, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [22, 23, 11, 44, 0, 0, 0, 0, 0, 0, 0, 0], 
    [14, 17, 14, 6, 16, 33, 0, 0, 0, 0, 0, 0], 
    [11, 11, 14, 10, 4, 7, 17, 26, 0, 0, 0, 0], 
    [9, 8, 10, 11, 7, 4, 4, 9, 17, 21, 0, 0], 
    [7, 7, 8, 9, 8, 6, 4, 3, 5, 10, 15, 18]]
  ;

  //seed with new lockedPercent
  function setPartitionChoices(uint[12][6] calldata _newChoices) onlyNcenoAdmin external {
    partitionChoices = _newChoices;
  }

  
  address ncenoAdmin = 0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a; //portis mainnet

  function setNcenoAdmin(address _newAdmin) onlyNcenoAdmin external{
    ncenoAdmin = _newAdmin;
  }

  //set the valid heart rate threshold
  uint hrThresh = 99;
  function setHRthresh(uint _newThresh) onlyNcenoAdmin external{
    hrThresh = _newThresh;
  }

  //---------for testing only!!!!!!!!!
/*  function getTestETH() public{
    getSender().transfer(500000000000000000);
  }

  function recoverETH(uint _eth) public{
    admin.transfer(_eth*1000000000000000000);
  }*/
  //---------   /for testing only!!!!!!!!!

  

  //--------------------------
  //--- /admin functions
  //--------------------------
}