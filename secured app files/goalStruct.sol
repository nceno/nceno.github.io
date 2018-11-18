pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;
//Author: Joe Nance
//Title: Nceno goal object, creation, and registry

//Description: After GoalFactory is deployed, a user can type some parameters and with a single click, a new goal will be deployed
//with those parameters and (separately) loaded with the intended stake. The GoalFactory contract also acts as a registry where the admin can 
//retreive a list of all goals ever set by a fitbitID (user ID).


contract GoalFactory {

  
  //make the goal object, replacing a contract
  struct goalObject{
    address owner;
    bytes32 name;
    bytes32 email;
    bytes32 fitbitID;
    uint activeMinutes;
    uint rounds;
    bytes32 beginAt;
    uint stake;
    uint sucPayouts;
    uint256 totalPaidOut;
    uint256 timeCreated;
  }

  //make a "history" for each player of their goals
  struct PlayerGoalHistory{
     goalObject[] hostedGoals; //needs to be a goalObject array: goalObject[] hostedGoals
    }
    
  //****************************************************  
  //make a dictionary of timestamps by userID  
  struct stamps{
    mapping(uint256 => bool) fbTimes;
  }
  mapping(bytes32 => stamps) allLogs;
  //allLogs[userID].fbTimes[timeStamp]
  //*************************************************
  //0x6761766f66796f726b0000000000000000000000000000000000000000000000
  
  //make a registry of ALL histories, accessible by a SINGE UNIQUE fitbitID
  mapping (bytes32 => PlayerGoalHistory) goalsByFitbit;
  
  //registry of all goals, (only indexed by order of deployment).
  goalObject[] allGoals; //needs to be a goalObject array: goalObject[] allGoals

  //fire event on contract creation
  event goalInfo(
       address owner,
       bytes32 name,
       bytes32 email,
       bytes32 fitbitID,
       uint activeMinutes,
       uint rounds,
       bytes32 beginAt,
       uint stake,
       uint256 timeCreated);


//spawn a new goal with intended parameters
  function createGoal(bytes32 _name, bytes32 _email, bytes32 _fitbitID, uint _activeMinutes, uint _rounds,bytes32 _beginAt, uint _stake) external payable {
    address creator = msg.sender;
    //address owner = msg.sender;
      
      goalObject memory createdGoal; 
      createdGoal.owner = creator;
      createdGoal.name = _name;
      createdGoal.email = _email;
      createdGoal.fitbitID = _fitbitID;
      createdGoal.activeMinutes = _activeMinutes;
      createdGoal.rounds = _rounds;
      createdGoal.beginAt = _beginAt;
      createdGoal.stake = _stake;
      createdGoal.sucPayouts = 0;
      createdGoal.timeCreated = now;
      goalInfo(creator, _name, _email, _fitbitID, _activeMinutes, _rounds,  _beginAt,  _stake, now);

      //add it to the registry
      allGoals.push(createdGoal);
      //add it to the player's history
      goalsByFitbit[_fitbitID].hostedGoals.push(createdGoal);
      
      
    }
  //reverse 6-week payout partitions: {6.26423, 12.2763, 24.3988, 12.7989, 26.097, 18.1647}
  uint[] partitions = [6,12,25,13,26,18];
  
//only admin modifier (assumes Nceno wallet address is the admin)
    modifier onlyNceno {
        require(msg.sender == nceno);
        _;
    }

    //addresses where lost stake goes
    //address nceno = 0xa53f4A461c4f109D31ADA8a02c0A73F5762603dD; //address 3 metamask rinkeby net
    //address nceno = 0x5e67903bbf7ea3c5f54bd2b81e3d96ee2d12394a; //status.im mainnet account 1
   address nceno = 0x861CD7c8b659cF685B7d459a6710DFfdc305464b; //metamask mainnet account 3 (admin also)

//get the total number of goals created so far
  function getGoalCount() external view returns (uint) {
      return allGoals.length;
    }
  
 //get a list of all the goals created
  function getAllGoals() external view returns (goalObject[]) {
      return allGoals;
    }
  
 //lookup function. Given a fitbitID, return a list of all goals associated to it.
  function getGoalsByFitbitID(bytes32 _fbID) view external returns (goalObject[]) {   
        return goalsByFitbit[_fbID].hostedGoals;
    }
  
  
  //lookup function. Given a fitbitID, returns the address of the last goal deployed by it.
  function getLastGoalByFitbitID(bytes32 _fbID) view external returns (goalObject ) {   
        uint theLast = goalsByFitbit[_fbID].hostedGoals.length -1;
        return goalsByFitbit[_fbID].hostedGoals[theLast];
    }

  //returns partial stake to user when they win a milestone. Funds go to the address that created the goal.
  function userPayout(address userAddress,uint256 payout) onlyNceno external payable{
        
        userAddress.transfer(payout);
        
    }
//sends all stake to nceno wallet (set above)
  function ncenoTotalWithdrawal() onlyNceno external payable{
        
        nceno.transfer(address(this).balance);
    }
//sends partial lost stake to nceno wallet (set above)
  function ncenoWithdrawal(uint256 withdrawal) onlyNceno external payable{
        
        nceno.transfer(withdrawal);
    }

//settleLog
function settleLog(bytes32 userID, uint reportedMins, uint256 timeStamp) external payable{
  //payment logic
  uint theLast = goalsByFitbit[userID].hostedGoals.length -1;
  goalObject memory theGoal = goalsByFitbit[userID].hostedGoals[theLast]; //if this doesn't work, try it long-hand without a variable
  uint myTargetMins = theGoal.activeMinutes;
  bool logExists = allLogs[userID].fbTimes[timeStamp];
  if(reportedMins >= myTargetMins && theGoal.sucPayouts < 7 && !logExists){
  //TODO: convert stake to wei and use safemath for division
  //TODO: restrict to only one payout per day
  uint payout = partitions[theGoal.sucPayouts]*theGoal.stake/100;  //remember the offset by 1 for array index
    theGoal.owner.transfer(payout);
    theGoal.sucPayouts++;
    allLogs[userID].fbTimes[timeStamp]=true;
    theGoal.totalPaidOut += payout;
    //TODO: emit event when payout happens
  }
}

}
//end of GoalFactory contract
