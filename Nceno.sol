pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2; //to return a struct in a function
//import "./ERC20Interface.sol";
//import "./KyberNetworkProxy.sol";
import "./RelayRecipient.sol";

//stravaID: 0123456
//username: 0x6d6574616d61736b5f6a6e
//flag: 0x7573
//web3.utils.toHex('');
//1000100000000000000*targetStake/ethPrice


//inherit gas station relay contract
contract Nceno is RelayRecipient{
//contract Nceno {
  //adr 1 on metamask ropsten
  address admin = 0x7a3857cE0e3F8dA8e8e1c7Dbf7642cD7243de22F;
  function setAdmin(address _newAdmin) onlyAdmin external{
    admin = _newAdmin;
  }

  uint hrThresh = 100;
  function setHRthresh(uint _newThresh) onlyAdmin external{
    hrThresh = _newThresh;
  }

  address hubAddress = 0x1349584869A1C7b8dc8AE0e93D8c15F5BB3B4B87; //ropsten
  //gas station init
  function Nceno(){
    init_relay_hub(RelayHub(hubAddress));
  }

  struct goalObject{
    bytes32 goalID;
    uint startTime;
    uint activeMins;
    uint wks;
    uint stakeUSD; //stake in usd
    uint sesPerWk;
    uint ethPricePennies; //this is the usd price of eth, but multiplied by 100.

    uint[12] lockedPercent;
    uint[10] competitorIDs;
    uint competitorCount;
    uint[12] potWk;
    uint[12] winnersWk;
    mapping(uint=>uint[12]) successes;
    mapping(uint=>uint[12]) claims;
    mapping(uint=>uint) ethPricePenniesAtJoin;
    mapping(uint=>bool) activitySpent;
    mapping(uint=>bool) isCompetitor;
  }
  mapping(bytes32=>goalObject) internal goalAt;
  mapping(uint=>goalObject) public goalInstance;
  uint public goalCount;
  bytes32[] public goalIDs;

  //payout lockedPercent based on wks parameter
  uint[12][6] lockedPercent = partitionChoices[0];
  uint[12][6][2] partitionChoices =[ 
    //choice 1
    [[43, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [13, 30, 21, 36, 0, 0, 0, 0, 0, 0, 0, 0], 
    [7, 12, 24, 13, 26, 18, 0, 0, 0, 0, 0, 0], 
    [3, 10, 9, 21, 12, 10, 24, 11, 0, 0, 0, 0], 
    [2, 7, 7, 9, 18, 11, 4, 17, 16, 9, 0, 0], 
    [2, 5, 7, 5, 9, 15, 10, 3, 8, 18, 11, 7]],
    //choice 2
    [[45, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [22, 23, 11, 44, 0, 0, 0, 0, 0, 0, 0, 0], 
    [14, 17, 14, 6, 16, 33, 0, 0, 0, 0, 0, 0], 
    [11, 11, 14, 10, 4, 7, 17, 26, 0, 0, 0, 0], 
    [9, 8, 10, 11, 7, 4, 4, 9, 17, 21, 0, 0], 
    [7, 7, 8, 9, 8, 6, 4, 3, 5, 10, 15, 18]]
  ];

  //seed with new lockedPercent
  function setPartitionChoices(uint[12][6][2] _newChoices) onlyAdmin external {
    partitionChoices = _newChoices;
  }

  struct competitorObject{
    uint stravaID;
    bytes32 userName;
    address walletAdr;
    uint born;
    bytes32 flag;
    uint OS;
    mapping(bytes32=>goalObject) myGoal;
    uint myGoalCount;
    mapping(uint=>goalObject) mygoalInstance;

  }

  mapping(uint=>competitorObject) public profileOf;
  uint[] stravaIDs;
  mapping(uint=>bool) public userExists;


  function makeProfile(uint _stravaID, bytes32 _userName, bytes32 _flag, uint _OS) external{
    require(userExists[_stravaID] == false, "This profile already exists.");
    competitorObject memory createdCompetitor;

    //poulate identifiers
    createdCompetitor.stravaID = _stravaID;
    createdCompetitor.userName = _userName;
    createdCompetitor.walletAdr = get_sender();
    createdCompetitor.born = now;
    createdCompetitor.flag = _flag;
    createdCompetitor.OS = _OS;

    //add to registry
    profileOf[_stravaID] = createdCompetitor;
    userExists[_stravaID] = true;
    stravaIDs.push(_stravaID);
  }

  function host(bytes32 _goalID, uint _activeMins,  uint _stakeUSD, uint _sesPerWk, uint _wks, uint _startTime, uint _stravaID, uint _ethPricePennies) external payable {
    require(userExists[_stravaID]== true && profileOf[_stravaID].walletAdr == get_sender() && msg.value>= 100*1000000000000000000*_stakeUSD/_ethPricePennies,
     "User does not exist, or wallet-user pair does not match."); //get_sender()
    goalObject memory createdGoal;

    //populate parameters
    createdGoal.goalID = _goalID;
    createdGoal.startTime = _startTime;
    createdGoal.activeMins = _activeMins;
    createdGoal.wks = _wks;
    createdGoal.stakeUSD = _stakeUSD;
    createdGoal.sesPerWk = _sesPerWk;
    createdGoal.ethPricePennies = _ethPricePennies;

    //set logs and claims to [0]?

    //set weekly lockup percentages
    createdGoal.lockedPercent = partitionChoices[now % 2][_wks/2 -1];

    //set host as first competitor
    createdGoal.competitorIDs[0] = _stravaID;
    createdGoal.competitorCount++;
    goalAt[_goalID].isCompetitor[_stravaID] = true;

    //push goal to registry
    goalAt[_goalID] = createdGoal;
    goalInstance[goalCount] = createdGoal;
    goalCount++;

    //add goal to self's registry
    profileOf[_stravaID].myGoal[_goalID] = createdGoal;
    profileOf[_stravaID].mygoalInstance[profileOf[_stravaID].myGoalCount] = createdGoal;
    profileOf[_stravaID].myGoalCount++;

    //kyber step
    //swapEtherToTokenWithChange (0x818E6FECD516Ecc3849DAf6845e3EC868087B755, 0xaD6D458402F60fD3Bd25163575031ACDce07538D, this, max, rate);

  }

  function join(bytes32 _goalID, uint _stravaID, uint _ethPricePennies) external payable {
    require(now < goalAt[_goalID].startTime && msg.value >= goalAt[_goalID].stakeUSD*_ethPricePennies && goalAt[_goalID].isCompetitor[_stravaID] == false, "Challenge already started, user already is a participant, or else message value is less than intended stake.");
    //add self as competitor
    goalAt[_goalID].competitorIDs[goalAt[_goalID].competitorCount] = _stravaID;
    goalAt[_goalID].competitorCount++;
    goalAt[_goalID].isCompetitor[_stravaID] = true;

    //set logs and claims to [0]?

    //add goal to own registry
    profileOf[_stravaID].myGoal[_goalID] = goalAt[_goalID];
    profileOf[_stravaID].mygoalInstance[profileOf[_stravaID].myGoalCount] = goalAt[_goalID];
    profileOf[_stravaID].myGoalCount++;

    //kyber step
    //swapEtherToTokenWithChange (0x818E6FECD516Ecc3849DAf6845e3EC868087B755, 0xaD6D458402F60fD3Bd25163575031ACDce07538D, this, max, rate);
  }

  function log(bytes32 _goalID, uint _stravaID, uint _activityID, uint _avgHR, uint _reportedMins) external{
    require(profileOf[_stravaID].walletAdr == get_sender() && goalAt[_goalID].isCompetitor[_stravaID]==true && 
      (goalAt[_goalID].startTime < now) && (now < goalAt[_goalID].startTime + goalAt[_goalID].wks*1 weeks), 
      "wallet-user mismatch, user is not competitor, goal has not started, or week has already passed"); //get_sender()
    uint wk = (now - goalAt[_goalID].startTime)/604800;
    
    //payment logic for activity comparison, HR check, timestamp double spending, and limited payouts per week
    if(_reportedMins >= goalAt[_goalID].activeMins && _avgHR >= hrThresh && goalAt[_goalID].activitySpent[_activityID]==false && goalAt[_goalID].successes[_stravaID][wk]<goalAt[_goalID].sesPerWk){
      
      //payout a refund- needs kyberswap adjustment
     
      uint payout = 1000000000000000000*goalAt[_goalID].stakeUSD*goalAt[_goalID].lockedPercent[wk]/(goalAt[_goalID].ethPricePennies*goalAt[_goalID].sesPerWk);
      get_sender().transfer(payout); //get_sender()
      //IERC20Token(tokenContractAddress).transfer(get_sender(), payout); //get_sender()

      //note the success     
      goalAt[_goalID].successes[_stravaID][wk]++;
      //protect activity from double spending 
      goalAt[_goalID].activitySpent[_activityID]=true;
    }
    else revert("reported minutes not enough, timestamp already used, or weekly submission quota already met.");
  }

  function claim(bytes32 _goalID, uint _stravaID) external{
    //must have 100% adherence for the previous week, and can only claim once.
    require(profileOf[_stravaID].walletAdr == get_sender() && goalAt[_goalID].isCompetitor[_stravaID]==true &&  
      goalAt[_goalID].successes[_stravaID][(now-goalAt[_goalID].startTime)/604800-1]==goalAt[_goalID].sesPerWk && 
      goalAt[_goalID].claims[_stravaID][(now-goalAt[_goalID].startTime)/604800] == 0,
      "wallet-user mismatch, user not a competitor, user not 100% adherent for the week, or user already claimed bonus for the week."
    ); //get_sender()

    uint winners;
    uint cut;
    uint pot;
    uint logs;
    uint payout = goalAt[_goalID].lockedPercent[(now-goalAt[_goalID].startTime)/604800-1]*goalAt[_goalID].stakeUSD/(100*goalAt[_goalID].sesPerWk);
    //loop over everyone's weekly logs and increase the week's pot from when someone skipped a workout
    for(uint i =0; i<10; i++){
    if(goalAt[_goalID].competitorIDs[i] != 0x0000000000000000000000000000000000000000000000000000000000000000){
        //pot equals total weekly sessions minus total logs, all times payout
        logs+= goalAt[_goalID].successes[goalAt[_goalID].competitorIDs[i]][(now-goalAt[_goalID].startTime)/604800-1];
        //keep track of the number of winners, those with 100% adherence, in the previous week. 
        if(goalAt[_goalID].successes[goalAt[_goalID].competitorIDs[i]][(now-goalAt[_goalID].startTime)/604800-1]==goalAt[_goalID].sesPerWk){
          winners++;
        }
      }
    }
    pot = payout*(goalAt[_goalID].competitorCount*goalAt[_goalID].sesPerWk - logs);
    goalAt[_goalID].potWk[(now-goalAt[_goalID].startTime)/604800-1] = pot; //write to the global goal stats

    cut = pot/(2*winners);
    
    //protect against bonus double spending
    goalAt[_goalID].claims[_stravaID][(now-goalAt[_goalID].startTime)/604800-1] = 1;

    //needs USDC adjustment
    get_sender().transfer(cut); //get_sender()
    //IERC20Token(tokenContractAddress).transfer(get_sender(), payout); //get_sender()
  }

  function takeRevenue(uint _amount) onlyAdmin external{
    admin.transfer(_amount);
    //IERC20Token(tokenContractAddress).transfer(admin, _amount);
  }

  modifier onlyAdmin(){
    require(get_sender() == admin,"Sender not authorized."); //get_sender()
    _;
  }

  //getters for UI
  //get goal
  function getGoalParams(bytes32 _goalID) external view returns(uint, uint, uint, uint, uint, uint){
    return(goalAt[_goalID].activeMins, goalAt[_goalID].stakeUSD, goalAt[_goalID].sesPerWk, goalAt[_goalID].wks, goalAt[_goalID].startTime, goalAt[_goalID].competitorCount);
  }

  function getGoalArrays(bytes32 _goalID, uint _stravaID) external view returns(uint[12], uint[12], uint[12], uint[10]){
    return(goalAt[_goalID].lockedPercent, goalAt[_goalID].successes[_stravaID], goalAt[_goalID].winnersWk, goalAt[_goalID].competitorIDs);
  }

  function getSuccessesClaims(bytes32 _goalID, uint _stravaID) external view returns(uint[12], uint[12]){
    return(goalAt[_goalID].successes[_stravaID], goalAt[_goalID].claims[_stravaID]);
  }

  //called when a user logs a workout. returns the percent earned per workout, and the amount $ earned per workout
  function getGoalPartitions(bytes32 _goalID) external view returns (uint, uint){
    uint wk = (now - goalAt[_goalID].startTime)/604800;
    return(goalAt[_goalID].lockedPercent[wk-1]/goalAt[_goalID].sesPerWk, goalAt[_goalID].stakeUSD*goalAt[_goalID].lockedPercent[wk-1]*100/goalAt[_goalID].sesPerWk);
  }

  //get future goal: only returns a goal if it hasn't started yet
  function getFutureGoal(uint _index) external view returns(bytes32, uint, uint, uint, uint, uint, uint){
    if(now < goalInstance[_index].startTime){
      bytes32 id = goalInstance[_index].goalID;
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

  function getParticipants( bytes32 _goalID) external view returns(uint[10], bytes32[10], bytes32[10]){
    uint[10] memory ids;
    bytes32[10] memory names;
    bytes32[10] memory flags;

    goalObject memory theGoal = goalAt[_goalID];
    uint compcount = theGoal.competitorCount;
    for(uint i =0; i<compcount; i++){
      if(theGoal.competitorIDs[i] != 0x0000000000000000000000000000000000000000000000000000000000000000){
        ids[i] = theGoal.competitorIDs[i];
        names[i] = profileOf[theGoal.competitorIDs[i]].userName;
        flags[i] = profileOf[theGoal.competitorIDs[i]].flag;
      }
    }
    return(ids, names, flags);
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
 
  function getMyGoalStats1(uint _stravaID, bytes32 _goalID) external view returns(uint, uint, uint){
    goalObject memory theGoal = goalAt[_goalID];
    uint wk = 1+(now - theGoal.startTime)/604800;
    
      myStatsObject memory my;
      my.adherenceRate=0;
      my.totalAtStake=0;
      uint successCount=0;
      
    if(wk>=1 && wk<theGoal.wks+1){
      for(uint i =0; i<wk; i++){
        successCount += goalAt[_goalID].successes[_stravaID][i];
      }
      my.adherenceRate = 100*successCount/(wk*theGoal.sesPerWk); 
      
      for(uint p=wk; p<theGoal.wks; p++){
        my.totalAtStake += theGoal.lockedPercent[p]*theGoal.stakeUSD*theGoal.competitorCount/100;
      }
    }
    return(my.adherenceRate, my.totalAtStake, successCount);
  }

  function successPerGoal(uint _stravaID, bytes32 _goalID) external view returns(uint, uint, uint, uint){
    goalObject memory theGoal = goalAt[_goalID];
    //uint wk = (now - theGoal.startTime)/604800;
    //if(wk>theGoal.wks){
      myStatsObject memory my;
      uint successCount;
      for(uint j =0; j<theGoal.wks; j++){
        successCount += goalAt[_goalID].successes[_stravaID][j];
        my.wkPayouts[j] = theGoal.lockedPercent[j]*goalAt[_goalID].successes[_stravaID][j]*theGoal.stakeUSD/theGoal.sesPerWk; //in pennies
        my.lostStake+=(theGoal.lockedPercent[j]*theGoal.stakeUSD-my.wkPayouts[j]); //in pennies
        my.wkBonuses[j] = goalAt[_goalID].claims[_stravaID][j]*theGoal.potWk[j]/(theGoal.winnersWk[j]*2);
        my.bonusTotal+= my.wkBonuses[j];
        
      }       
      return(successCount, theGoal.sesPerWk, my.lostStake, my.bonusTotal);
    //}
  }
    
  function getMyGoalStats2(uint _stravaID, bytes32 _goalID) external view returns(uint[12], uint, uint[12], uint, uint){
    goalObject memory theGoal = goalAt[_goalID];
    //uint wk = (now - theGoal.startTime)/604800;

    //catches completed goals
    uint wkLimit;
    if((now - theGoal.startTime)/604800<theGoal.wks+1){
      wkLimit = 1+(now - theGoal.startTime)/604800; //active
    }else wkLimit = theGoal.wks; //completed
    
    myStatsObject memory my;
      my.lostStake = 0;
      my.bonusTotal = 0;
      uint totalPay=0;

      for(uint j =0; j<wkLimit; j++){

        my.wkPayouts[j] = theGoal.lockedPercent[j]*goalAt[_goalID].successes[_stravaID][j]*theGoal.stakeUSD/theGoal.sesPerWk; //in pennies

        if(theGoal.winnersWk[j]>0){
          my.wkBonuses[j] = goalAt[_goalID].claims[_stravaID][j]*theGoal.potWk[j]/(theGoal.winnersWk[j]*2);
          my.bonusTotal+= my.wkBonuses[j];
        }

        totalPay+= my.wkPayouts[j]; //in pennies

        if(j<(now - theGoal.startTime)/604800){
          my.lostStake+=(theGoal.lockedPercent[j]*theGoal.stakeUSD-my.wkPayouts[j]); //in pennies
        }
      }
    return(my.wkPayouts, my.lostStake, my.wkBonuses, my.bonusTotal, totalPay); //result[0], result[1], result[4] wkPayouts,lostStake,totalPay should be /100 in JS
  }

  //get upcoming goal: only returns a user's goal if it hasn't yet started
  function getUpcomingGoal(uint _stravaID, uint _index) external view returns(bytes32){
    require(now < profileOf[_stravaID].mygoalInstance[_index].startTime );
    return(profileOf[_stravaID].mygoalInstance[_index].goalID);    
  }

  //get active goal: only returns a user's goal if it has already started
  function getActiveGoal(uint _stravaID, uint _index) external view returns(bytes32){
    require((0 < now - profileOf[_stravaID].mygoalInstance[_index].startTime) && (now-profileOf[_stravaID].mygoalInstance[_index].startTime < profileOf[_stravaID].mygoalInstance[_index].wks*604800));
    return(profileOf[_stravaID].mygoalInstance[_index].goalID);    
  }

  //get completed goal: only returns a user's goal if it has completed
  function getCompletedGoal(uint _stravaID, uint _index) external view returns(bytes32){
    require(now > profileOf[_stravaID].mygoalInstance[_index].startTime + profileOf[_stravaID].mygoalInstance[_index].wks*604800);
    return(profileOf[_stravaID].mygoalInstance[_index].goalID);    
  }

  function getProfile(uint _stravaID) external view returns(address, uint, bytes32, uint, uint){
    return(profileOf[_stravaID].walletAdr, profileOf[_stravaID].born , profileOf[_stravaID].flag , profileOf[_stravaID].OS , profileOf[_stravaID].myGoalCount);
  }

  function getMyGoalInstance(uint _stravaID, uint _instance) external view returns(bytes32){
    return(profileOf[_stravaID].mygoalInstance[_instance].goalID);
  }


  //-----------------------------------------------
  //kyber stuff
  //-----------------------------------------------

  //@param _kyberNetworkProxy kyberNetworkProxy contract address
    //@param token destination token contract address
    //@param destAddress address to send swapped tokens to
    //@param maxDestQty max number of tokens in swap outcome. will be sent to destAddress
    //@param minRate minimum conversion rate for the swap
    /*function swapEtherToTokenWithChange (KyberNetworkProxyInterface _kyberNetworkProxy,ERC20 token,address destAddress,uint maxDestQty,uint minRate) public payable{
        //note that this.balance has increased by msg.value before the execution of this function
        uint startEthBalance = this.balance;
        
        //send swapped tokens to dest address. change will be sent to this contract.
        _kyberNetworkProxy.trade.value(msg.value)(ETH_TOKEN_ADDRESS, msg.value, token, destAddress, maxDestQty, minRate, 0);
        
        //calculate contract starting ETH balance before receiving msg.value (startEthBalance - msg.value)
        //change = current balance after trade - starting ETH contract balance (this.balance - (startEthBalance - msg.value))
        uint change = this.balance - (startEthBalance - msg.value);
        SwapEtherChange(startEthBalance, this.balance, change);
        
        //return change to get_sender()
        get_sender().transfer(change); //get_sender()
    }*/

  //-----------------------------------------------
  //gas station relay stuff
  //-----------------------------------------------

  //replaced all get_sender() with get_sender()
 
  //Returning 0 means you accept sponsoring the relayed transaction. Anything else indicates rejection.
  function accept_relayed_call(address relay, address from, bytes memory encoded_function, uint gas_price, uint transaction_fee) public view returns(uint32) {return 0;}


  function post_relayed_call(address relay, address from, bytes memory encoded_function, bool success, uint used_gas, uint transaction_fee) public {
  //This is where you would usually subtract from the user's remaining credit (if success == true), throw an event, etc.
  }
  
}