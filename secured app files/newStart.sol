pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2; //to return a struct in a function

//string to bytes32 converter
//web3.padRight(web3.fromAscii('a string of text'), 34)
//"0x6120676f616c20696400000000000000"
//"0x736f6d65207573657220494400000000"

contract GoalFactory {
  //addresses where lost stakeWEI goes
  address nceno = 0xa53f4A461c4f109D31ADA8a02c0A73F5762603dD; //metamask rinkeby account (admin also)
  
  //the competitor object
  struct competitorObject{
    bytes32 wearableID; //unique
    bytes32 wearableModel; //fitbit, garmin, apple, xiaomi, samsung, etc.
    bytes32 name;
    bytes32 email;
    address walletAdr;
    mapping(uint => goalObject) goalAt; //index of historical goals
      uint goalTotal;
  }
  mapping(bytes32 => competitorObject) internal profileOf; //registry of ALL users' info, indexed by wearableID
    mapping(bytes32 => bool) internal userExists; //to check if a user is registered with Nceno (used only when creating a new competitor)

  function createCompetitor(bytes32 _wearableID, bytes32 _wearableModel, bytes32 _name, bytes32 _email) external {
    require(userExists[_wearableID] == false);
    competitorObject memory createdCompetitor;
    createdCompetitor.wearableID = _wearableID;
    createdCompetitor.wearableModel = _wearableModel;
    createdCompetitor.name = _name;
    createdCompetitor.email = _email;
    createdCompetitor.walletAdr = msg.sender;

    //add to registry
    profileOf[_wearableID] = createdCompetitor;
    userExists[_wearableID] = true;

    //fire event: _userID made a profile with params: @1, @2, ...
    emit ProfileCreated(_wearableID, _wearableModel, _name, _email, msg.sender);
  }
  
  event ProfileCreated(bytes32 _wearableID, bytes32 _wearableModel, bytes32 _name, bytes32 _email, address _walletAdr);

  //get profile**********************************

  struct stampList{
    mapping(uint256 => bool) stampExists; //checks if a timestamp exists. each user in a goal will have one of these
  }

  //the goal object
  struct goalObject{
    bytes32 goalID; //should be something that is robust across the platform. Unix timestamp passed in from javascript UI will work. (createGoal)
    uint activeMins; //minutes per exercise session (20 - 180)
    uint stakeWEI;
    uint sesPerWk; //exercise days per week (1,2,3,4,5,6,7)
    uint wks; //duration (2,4,6,8,10,12) in weeks
    uint256 startTime;
        
    mapping(bytes32 => uint[12]) successes; //number of successes in a given week by a given competitor (simplePayout)
    mapping(bytes32 => stampList) timeLog; //timestamps used by a user, for each user
    
    mapping(bytes32 => bool) isCompetitor; //checks whether a user is a competitor (join, createGoal)
      uint competitorCount; //number of competitors in the goal
      bytes32[10] competitor; //iterable list of competitors
    
    uint[12] potWk; //amt of lost stakeWEI ether available to claim as bonus for each week (claim, simplePayout)
    uint[12] winnersWk; //number of 100% adherers for a given week (simplePayout)
    mapping(bytes32 => uint[12]) bonusWasClaimed; //to check if a weekly bonus was claimed by each user (claim)
  }
 
  mapping(uint => goalObject) iterableGoals; //iterable registry of all goals created, (only indexed by order of deployment).
    uint public goalCount; //total number of goals
    mapping(bytes32 => goalObject) internal goalRegistry; //dictionary of goals, accessible by goalID

  //get goal
  function getGoalParams(bytes32 _goalID) external view returns(uint, uint, uint, uint, uint, bytes32[10]){
    return(goalRegistry[_goalID].activeMins, goalRegistry[_goalID].stakeWEI, goalRegistry[_goalID].sesPerWk, goalRegistry[_goalID].wks, goalRegistry[_goalID].startTime, goalRegistry[_goalID].competitor);
  }

  //get future goal: only returns a goal if it hasn't started yet
  function getFutureGoal(uint _index) external view returns(bytes32, uint, uint, uint, uint, uint, bytes32[10]){
    if(now < iterableGoals[_index].startTime){
      return(iterableGoals[_index].goalID, iterableGoals[_index].activeMins, iterableGoals[_index].stakeWEI, iterableGoals[_index].sesPerWk, iterableGoals[_index].wks, iterableGoals[_index].startTime,iterableGoals[_index].competitor);
    }
  }

  //get personal stats***********************
  struct myStatsObject{
    uint adherenceRate; //
    uint[12] wkPayouts;
    uint lostStake;
    uint[12] wkBonuses;
    uint bonusTotal;
    uint roi;
    uint totalAtStake;
  }
 
  
  function getMyGoalStats1(bytes32 _userID, bytes32 _goalID) external view returns(uint, uint){
    uint wk = (now - goalRegistry[_goalID].startTime)/604800;
    if(0<=wk && wk<goalRegistry[_goalID].wks+1){
      
      myStatsObject memory my;
      uint successCount;
      for(uint i =0; i<wk; i++){
        successCount += goalRegistry[_goalID].successes[_userID][i];
      }
      my.adherenceRate = 100*successCount/(wk*goalRegistry[_goalID].sesPerWk); 
      
      for(uint p =wk; p<goalRegistry[_goalID].wks; p++){
        my.totalAtStake += partitions[goalRegistry[_goalID].wks/2 -1][p]*goalRegistry[_goalID].stakeWEI*goalRegistry[_goalID].competitorCount/100;
      }  
                 
      return(my.adherenceRate, my.totalAtStake);
    }
  }
  
  
  function getMyGoalStats2(bytes32 _userID, bytes32 _goalID) external view returns(uint[12], uint, uint, uint[12], uint){
    uint wk = (now - goalRegistry[_goalID].startTime)/604800;
    if(0<=wk && wk<goalRegistry[_goalID].wks+1){
      
      myStatsObject memory my;
      
      for(uint j =0; j<wk; j++){
        my.wkPayouts[j] = partitions[goalRegistry[_goalID].wks/2 -1][j]*goalRegistry[_goalID].successes[_userID][j]*goalRegistry[_goalID].stakeWEI/(100*goalRegistry[_goalID].sesPerWk);
      }

      for(uint k =0; k<wk; k++){
        my.lostStake+=(partitions[goalRegistry[_goalID].wks/2 -1][k]*goalRegistry[_goalID].stakeWEI/100-my.wkPayouts[k]);
      }

      for(uint m =0; m<wk; m++){
        my.wkBonuses[m] = goalRegistry[_goalID].bonusWasClaimed[_userID][m]*goalRegistry[_goalID].potWk[m]/(goalRegistry[_goalID].winnersWk[m]*2);
        my.bonusTotal+= my.wkBonuses[m];
      }

      uint totalPay;
      for(uint n =0; n<wk; n++){
        totalPay+= my.wkPayouts[n];
      }
      my.roi =100*(totalPay+my.bonusTotal)/goalRegistry[_goalID].stakeWEI;
      
      return(my.wkPayouts, my.roi, my.lostStake, my.wkBonuses, my.bonusTotal);
    }
  }

  //get the leaderboard
  function getLeaderBoard(bytes32 _goalID) external returns(bytes32[10], uint[12][10]){
    uint[12][10] storage performances;
    bytes32[10] storage competitorName;
    for(uint i =0; i<10; i++){
    if(goalRegistry[_goalID].competitor[i] != 0x0000000000000000000000000000000000000000000000000000000000000000){
      //if(bytes(goalRegistry[_goalID].competitor[i]).length != 0){
        competitorName[i] = profileOf[goalRegistry[_goalID].competitor[i]].name;
        performances[i] = goalRegistry[_goalID].successes[goalRegistry[_goalID].competitor[i]];
      }
    }
    return(competitorName, performances);
  }

  //payout partitions based on wks parameter
  uint[][] partitions = 
  [[25,75,0,0,0,0,0,0,0,0,0,0],
  [11,26,36,27,0,0,0,0,0,0,0,0],
  [6,12,25,13,26,18,0,0,0,0,0,0],
  [11,11,14,10,4,7,17,26,0,0,0,0],
  [9,8,10,11,7,4,4,9,17,21,0,0],
  [5,8,9,6,2,3,9,12,8,6,12,20]];

 
  //spawn a new goal with intended parameters
  function createGoal(bytes32 _goalID, uint _activeMins, uint _stakeWEI, uint _sesPerWk, uint _wks, uint256 _startTime, bytes32 _wearableID) external payable {
    require(msg.value == _stakeWEI);
    goalObject memory createdGoal; 
    //initialize params
    createdGoal.goalID = _goalID;
    createdGoal.activeMins = _activeMins;
    createdGoal.stakeWEI = _stakeWEI;
    createdGoal.sesPerWk = _sesPerWk;
    createdGoal.wks = _wks;
    createdGoal.startTime = _startTime;
          
    createdGoal.competitorCount = 1; //incriment competitor count
    createdGoal.competitor[0] = _wearableID; //add self to competitor list
    
    goalRegistry[_goalID] = createdGoal; //add goal to the registry
    iterableGoals[goalCount] = createdGoal; //add goal to iterable registry ***expensive!
    goalCount++; //incriment global count

    //fire event: _userID created _goalID with params: @1, @2, ...
    emit GoalCreated(_goalID, _activeMins, _stakeWEI, _sesPerWk, _wks, _startTime, _wearableID);
  }
  
  event GoalCreated(bytes32 _goalID, uint _activeMins, uint _stakeWEI, uint _sesPerWk, uint _wks, uint256 _startTime, bytes32 _wearableID);

  //the function used to join a challenge, if you know the goalID
  function joinGoal(bytes32 _goalID, bytes32 _userID) external payable{
    require(now < goalRegistry[_goalID].startTime && msg.value == goalRegistry[_goalID].stakeWEI); //time check and stake check
      
    //add self to goal
    goalRegistry[_goalID].isCompetitor[_userID] = true;
    goalRegistry[_goalID].competitor[goalRegistry[_goalID].competitorCount] = _userID;
    goalRegistry[_goalID].competitorCount++;
    
    //add goal to your own list
    profileOf[_userID].goalAt[profileOf[_userID].goalTotal] = goalRegistry[_goalID];
    profileOf[_userID].goalTotal++;

    //fire event: _userID joined _goalID
    emit CompetitorJoined(_userID, _goalID);
  }
  
  event CompetitorJoined(bytes32 _userID, bytes32 _goalID);

  //simple payout function when someone logs a workout
  function simplePayout(bytes32 _userID, uint _reportedMins, uint256 _timeStamp, bytes32 _goalID) external{
    //can only call if in challenge, and challenge is active
    require(goalRegistry[_goalID].isCompetitor[_userID]==true && (goalRegistry[_goalID].startTime < now) && (now < goalRegistry[_goalID].startTime + goalRegistry[_goalID].wks*1 weeks));
    
    uint wk = (now - goalRegistry[_goalID].startTime)/604800;
    
    //payment logic for activity comparison, timestamp double spending, and limited payouts per week
    if(_reportedMins >= goalRegistry[_goalID].activeMins && goalRegistry[_goalID].timeLog[_userID].stampExists[_timeStamp]==false && goalRegistry[_goalID].successes[_userID][wk]<goalRegistry[_goalID].sesPerWk){

      //payout a refund
      uint payout = partitions[goalRegistry[_goalID].wks/2 -1][wk]*goalRegistry[_goalID].stakeWEI/(100*goalRegistry[_goalID].sesPerWk);  //remember there is an offset by 1 for partition array index
      msg.sender.transfer(payout);
      goalRegistry[_goalID].successes[_userID][wk]++; //note the success
      goalRegistry[_goalID].timeLog[_userID].stampExists[_timeStamp]=true; //protect timestamp from double spending
      //fire event: _userID was refunded _amount from _goalID on _wk
      emit PayoutRedeemedBy(_userID, _goalID, wk, payout);
    }
    
  }

  event PayoutRedeemedBy(bytes32 _userID, bytes32 _goalID, uint _wk, uint _payout);

  //claims the bonus from lost stakeWEI of the previous week
  function claimBonus(bytes32 _goalID, bytes32 _userID) external{
    //must have 100% adherence for the previous week, and can only claim once.
    
    require(goalRegistry[_goalID].isCompetitor[_userID]==true && goalRegistry[_goalID].successes[_userID][(now-goalRegistry[_goalID].startTime)/604800-1]==goalRegistry[_goalID].sesPerWk && goalRegistry[_goalID].bonusWasClaimed[_userID][(now-goalRegistry[_goalID].startTime)/604800] == 0);
    
    uint wk = (now-goalRegistry[_goalID].startTime)/604800;
    uint winners;
    uint pot;
    uint payout = partitions[goalRegistry[_goalID].wks/2 -1][wk-1]*goalRegistry[_goalID].stakeWEI/(100*goalRegistry[_goalID].sesPerWk);
    //loop over everyone's weekly logs and increase the weeks pot from when someone skipped a workout
    for(uint i =0; i<10; i++){
    if(goalRegistry[_goalID].competitor[i] != 0x0000000000000000000000000000000000000000000000000000000000000000){
      //if(bytes(goalRegistry[_goalID].competitor[i]).length != 0){
        pot+= (goalRegistry[_goalID].sesPerWk - goalRegistry[_goalID].successes[goalRegistry[_goalID].competitor[i]][wk-1])*payout;
        //keep track of the number of winners, those with 100% adherence, in the previous week. 
        if(goalRegistry[_goalID].successes[goalRegistry[_goalID].competitor[i]][wk-1]==goalRegistry[_goalID].sesPerWk){
          winners++;
        }
      }
    }
    msg.sender.transfer(pot/(2*winners)); //initiate the payout
    goalRegistry[_goalID].bonusWasClaimed[_userID][wk-1] = 1; //protect against bonus double spending
    goalRegistry[_goalID].potWk[wk-1] = pot; //write to the global goal stats
    goalRegistry[_goalID].winnersWk[wk-1] = winners; //write to the global goal stats

    //fire event: _userID claimed _amount of lost stake from week _wk of _goalID.
    emit BonusClaimedBy(_userID, _goalID, pot/(2*winners), wk);
  }

  event BonusClaimedBy(bytes32 _userID, bytes32 _goalID, uint _amount, uint _wk);

  //replaces numerous "require()" statements, restricts caller to admin (nceno)
  modifier onlyNceno(){
    require(msg.sender == nceno,
      "Sender not authorized."
    );
    _;
  }

  //see our revenue from a single goal
  function getSingleRev(bytes32 _goalID) onlyNceno external view returns (uint){
    uint revenue;
    for(uint i =0; i<12; i++ ){
      revenue+= goalRegistry[_goalID].potWk[i];
    }
    return(revenue/2);
  }
  
  //cashout a single goal
  function singleCashout(bytes32 _goalID) onlyNceno external{
    uint revenue;
    for(uint i =0; i<12; i++){
      revenue+= goalRegistry[_goalID].potWk[i];
    }

    nceno.transfer(revenue/2);
  }

  //see our revenue from all active goals
  function getActiveRev() onlyNceno external view returns (uint){
    uint totalRev;
    for(uint j =0; j<goalCount; j++){
      if(now < iterableGoals[j].startTime + iterableGoals[j].wks*1 weeks){
        for(uint i =0; i<12; i++){
          totalRev+= iterableGoals[j].potWk[i];
        }
      } 
    }
    return(totalRev/2);
  }
  
  //cashout revenue from all active goals
  function activeCashout() onlyNceno external{
    uint totalRev;
    for(uint j =0; j<goalCount; j++){
      if(now < iterableGoals[j].startTime + iterableGoals[j].wks*1 weeks){
        for(uint i =0; i<12; i++){
          totalRev+= iterableGoals[j].potWk[i];
        }
      } 
    }

    nceno.transfer(totalRev/2);
  }

  //see our historical revenue from all past goals
  function getPastRev() onlyNceno public view returns (uint){
    uint pastRev;
    for(uint j =0; j<goalCount; j++){
      if(now > iterableGoals[j].startTime + iterableGoals[j].wks*1 weeks){
        for(uint i =0; i<12; i++){
          pastRev+= iterableGoals[j].potWk[i];
        }
      } 
    }
    return(pastRev/2);
  }
  
  //cashout past goals
  function pastCashout() onlyNceno external{
    uint pastRev;
    for(uint j =0; j<goalCount; j++){
      if(now > iterableGoals[j].startTime + iterableGoals[j].wks*1 weeks){
        for(uint i =0; i<12; i++){
          pastRev+= iterableGoals[j].potWk[i];
        }
      } 
    }

    nceno.transfer(pastRev/2);
  }

  //sends entire contract balance to nceno wallet in case of emergency
  function ncenoEmergencyCashout() onlyNceno external{
    nceno.transfer(address(this).balance);
  }
}//end of contract