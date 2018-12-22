pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
//Author: Joe Nance
//Title: Nceno goal object, creation, and registry

//Description: After GoalFactory is deployed, a user can type some parameters and with a single click, a new goal will be deployed
//with those parameters and (separately) loaded with the intended stake. The GoalFactory contract also acts as a registry where the admin can 
//retreive a list of all goals ever set by a fitbitID (user ID).

//bytes32 example
//0x6761766f66796f726b0000000000000000000000000000000000000000000000

contract GoalFactory {
  //the competitor object
  struct competitorObject{
    bytes32 name;
    bytes32 email;
    address wallet;
    bytes32 fitbitID; //acts as the username
    mapping(uint => goalObject) hostedGoals; //goal history
    uint goalTotal; //number of goals hosted or joined
    mapping(uint256 => bool) timeLogExists; //timestamps used for logs
  }
  mapping(string => competitorObject) userRegistry; //registry of all users, accessible by fitbitID
  mapping(string => bool) userExists; //to check if a user is registered

  function createCompetitor(bytes32 _name, bytes32 _email, bytes32 _fitbitID) external{
    competitorObject memory createdCompetitor;
    createdCompetitor.name = _name;
    createdCompetitor.email = _email;
    createdCompetitor.wallet = msg.sender;
    createdCompetitor.fitbitID = _fitbitID;
  }

  //the goal object
  struct goalObject{
    address owner; //host
    uint activeMinutes;
    uint rounds; //exercises per week
    uint wks; //duration (2,4,6,8,10,12) in weeks
    uint256 beginAt; 
    uint stake;
    mapping(string => uint[12]) fuse; //a counter to protect against too many payout calls. Each associated to a single user (createGoal)
    string goalID; //should be something that is robust across the platform. Unix timestamp passed in from javascript UI will work. (createGoal)
    string[10] competitors; //iterable list of competitors (join, createGoal)
    mapping(string => bool) isCompetitor; //tests whether a user is a competitor (join, createGoal)
    uint[12] pot; //amt of lost stake ether available to claim as bonus for each week (claim, simplePayout)
    uint[12] winners; //number of 100% adherers for a given week (simplePayout)
    mapping(string => uint[12]) progress; //number of rounds completed in a given week by a given competitor (simplePayout)
    mapping(string => bool[12]) bonusWasClaimed; //to check if a weekly bonus was claimed (claim)
    uint competitorCount; //number of competitors in the goal
    bool isActive; //true if beginAt< now < beginAt+wks*week (simplePayout)
  }

  //payout partitions based on wks parameter
  uint[][] partitions = 
  [[25,75,0,0,0,0,0,0,0,0,0,0],
  [11,26,36,27,0,0,0,0,0,0,0,0],
  [6,12,25,13,26,18,0,0,0,0,0,0],
  [11,11,14,10,4,7,17,26,0,0,0,0],
  [9,8,10,11,7,4,4,9,17,21,0,0],
  [5,8,9,6,2,3,9,12,8,6,12,20]];

  //addresses where lost stake goes
  //address nceno = 0xa53f4A461c4f109D31ADA8a02c0A73F5762603dD; //address 3 metamask rinkeby net
  //address nceno = 0x5e67903bbf7ea3c5f54bd2b81e3d96ee2d12394a; //status.im mainnet account 1
  address nceno = 0x861CD7c8b659cF685B7d459a6710DFfdc305464b; //metamask mainnet account 3 (admin also)

  //make a "history" for each player of their goals
  //struct PlayerGoalHistory{
    //goalObject[] hostedGoals; 
  //}
    
  //a dictionary of timestamps by userID  
  //struct stamps{
 //   mapping(uint256 => bool) timeLogExists; //to check if a timestamp has been used
 // }
 // mapping(bytes32 => stamps) allLogs; //gets a user's time logs
  
  //registry of ALL histories, accessible by a SINGE UNIQUE fitbitID(bytes32)
  //mapping (bytes32 => PlayerGoalHistory) goalsByFitbit; 
  goalObject[] allGoals; //registry of all goals, (only indexed by order of deployment).

  //dictionary of goals, accessible by goalID
  mapping(string => goalObject) goalRegistry

  
  //spawn a new goal with intended parameters
  function createGoal() external payable {
    //address creator = msg.sender;
    goalObject memory createdGoal; 
    //createdGoal.@param = _@param
      
    //initialize the log allowance fuse
    for(uint i=0; i< _wks; i++){
      createdGoal.fuse[i] = _rounds;
    }
    createdGoal.competitorCount = 1; //incriment competitor count
    createdGoal.competitors[0] = _fitbitID; //add self to competitor list
    createdGoal.isCompetitor[_fitbitID] = true; //ditto above
    //add goal to the registry
      //allGoals.push(createdGoal);
    goalRegistry[_goalID] = createdGoal; //replaces old line above
    //goalsByFitbit[_fitbitID].hostedGoals.push(createdGoal); //add goal to the player's history
  }

  //the function used to join a challenge, if you know the goalID
  function join(string _goalID) payable{
    //copy all the goal parameters and deposit the stake

    //add caller's ID to the competitor list, increase the competitorCount  
  }

  //simple payout function when someone logs a workout
  //VULNERABILITY!***: a user could load the contract in Remix and pass in arbitrary reportedMins, triggering a payout.
  function simplePayout(bytes32 userID, uint reportedMins, uint256 timeStamp, string _goalID) external payable{
    //payment logic
    //uint theLast = goalsByFitbit[userID].hostedGoals.length -1;
    //goalObject memory theGoal = goalsByFitbit[userID].hostedGoals[theLast]; //this should reference the goalID
    goalObject memory theGoal = goalRegistry[_goalID]; //replaces old line above

    uint myTargetMins = theGoal.activeMinutes;
    bool logExists = allLogs[userID].timeLogExists[timeStamp];
    uint wk = (now-theGoal.beginAt)/604800;

    if(reportedMins >= myTargetMins && !logExists && theGoal.fuse[wk]>0){

      //payout a refund
      uint payout = partitions[theGoal.wks/2 -1][wk]*theGoal.stake/(100*theGoal.rounds);  //remember there is an offset by 1 for partition array index
      theGoal.owner.transfer(payout);

      //tally a session for the week
      theGoal.fuse[wk]--;

      //protect timestamp from double spending
      allLogs[userID].timeLogExists[timeStamp]=true;

      //loop over everyone's weekly logs and increase the pot from when someone skipped a workout
      for(uint i =0; i++; i<10){
        if(theGoal.competitors[i] != 0){
          theGoal.pot[wk] += (theGoal.rounds - theGoal.competitors[i].progress[wk])*partitions[theGoal.wks/2 -1][wk]/(100*theGoal.rounds);
      
          //keep track of the number of winners, those with 100% adherence, in a given week. 
          if(theGoal.competitors[i].progress[wk]==theGoal.rounds){
            winners[wk]++;
          }
        }
        //emit event when payout happens
      }
    }
  }

  
  //the function used to claim the bonus from lost stake of the previous week
  function claim(string goalID){
    //require isCompetitor=true

    //must have 100% adherence for the previous week, and can only claim once.
    require(msg.sender.progress[wk]==rounds && msg.sender.bonusPaid[wk] != true)
    msg.sender.transfer(pot[wk-1]/(2*winners[wk-1]));
  }

  //only admin modifier (assumes Nceno wallet address is the admin)
  modifier onlyNceno {
    require(msg.sender == nceno);
    _;
  }

  //get a list of all the goals created
  function getAllGoals() external view returns (goalObject[]) {
    return allGoals;
  }
  
 //lookup function. Given a fitbitID, return a list of all goals associated to it.
  //function getGoalsByFitbitID(bytes32 _fbID) view external returns (goalObject[]) {   
    //return goalsByFitbit[_fbID].hostedGoals;
  //}
  
  /////////////last goal lookup function. Given a fitbitID, returns the address of the last goal deployed by it.
  //function getLastGoalByFitbitID(bytes32 _fbID) view external returns (goalObject ) {   
    //uint theLast = goalsByFitbit[_fbID].hostedGoals.length -1;
   // return goalsByFitbit[_fbID].hostedGoals[theLast];
  //}

  //sends all stake to nceno wallet (set above)
  function ncenoTotalWithdrawal() onlyNceno external payable{
    nceno.transfer(address(this).balance);
  }
}//end of contract
