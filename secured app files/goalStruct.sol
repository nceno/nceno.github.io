pragma solidity ^0.4.18;
pragma experimental ABIEncoderV2;
//Author: Joe Nance
//Title: Nceno goal object, creation, and registry

//Description: After GoalFactory is deployed, a user can type some parameters and with a single click, a new goal will be deployed
//with those parameters and (separately) loaded with the intended stake. The GoalFactory contract also acts as a registry where the admin can 
//retreive a list of all goals ever set by a fitbitID (user ID).

//testnet rinkeby: 0xa0b32a7238f24846e193338092e3405d33c9194e

contract GoalFactory {

  
  //make the goal object, replacing a contract
  struct goalObject{
    address owner;
    bytes32 name;
    bytes32 email;
    uint fitbitID;
    uint activeMinutes;
    uint rounds;
    bytes16 beginAt;
    uint stake;
  }

  //make a "history" for each player of their goals
  struct PlayerGoalHistory{
     goalObject[] hostedGoals; //needs to be a goalObject array: goalObject[] hostedGoals
    }
  
  //make a registry of ALL histories, accessible by a SINGE UNIQUE fitbitID
  mapping (uint => PlayerGoalHistory) goalsByFitbit;
  
  //registry of all goals, (only indexed by order of deployment).
  goalObject[] allGoals; //needs to be a goalObject array: goalObject[] allGoals

  //fire event on contract creation
  event goalInfo(
       address owner,
       bytes32 name,
       bytes32 email,
       uint fitbitID,
       uint activeMinutes,
       uint rounds,
       bytes16 beginAt,
       uint stake);

//spawn a new goal with intended parameters
  function createGoal(bytes32 _name, bytes32 _email, uint _fitbitID,uint _activeMinutes, uint _rounds,bytes16 _beginAt, uint _stake) public payable {
    address owner = msg.sender;
      goalInfo(owner, _name, _email, _fitbitID, _activeMinutes, _rounds,  _beginAt,  _stake);
      address creator = msg.sender;
     goalObject memory createdGoal =  goalObject(creator, _name,_email,_fitbitID,_activeMinutes,_rounds,_beginAt,_stake);
      //add it to the registry
      allGoals.push(createdGoal);
      //add it to the player's history
      goalsByFitbit[_fitbitID].hostedGoals.push(createdGoal);
      
      
    }
  
//only admin modifier (assumes Nceno wallet address is the admin)
    modifier onlyNceno {
        require(msg.sender == nceno);
        _;
    }

    //addresses where lost stake goes
    address nceno = 0xa53f4A461c4f109D31ADA8a02c0A73F5762603dD; //address 1 metamask rinkeby net
    //address nceno = 0x5e67903bbf7ea3c5f54bd2b81e3d96ee2d12394a; //status.im mainnet account 1
   //address nceno = 0x861CD7c8b659cF685B7d459a6710DFfdc305464b; //metamask mainnet account 2 (admin also)

//get the total number of goals created so far
  function getGoalCount() public view returns (uint) {
      return allGoals.length;
    }
  
 //get a list of all the goals created
  function getAllGoals() public view returns (goalObject[]) {
      return allGoals;
    }
  
 //lookup function. Given a fitbitID, return a list of all goals associated to it.
  function getGoalsByFitbitID(uint _fbID) view public returns (goalObject[]) {   
        return goalsByFitbit[_fbID].hostedGoals;
    }
  
  

  //lookup function. Given a fitbitID, returns the address of the last goal deployed by it.
  function getLastGoalByFitbitID(uint _fbID) view public returns (goalObject ) {   
        uint theLast = goalsByFitbit[_fbID].hostedGoals.length -1;
        return goalsByFitbit[_fbID].hostedGoals[theLast];
    }

  //returns partial stake to user when they win a milestone. Funds go to the address that created the goal.
  function userPayout(address userAddress,uint256 payout) onlyNceno public payable{
        
        userAddress.transfer(payout);
        
    }
//sends all stake to nceno wallet (set above)
  function ncenoTotalWithdrawal() onlyNceno public payable{
        
        nceno.transfer(address(this).balance);
    }
//sends partial lost stake to nceno wallet (set above)
  function ncenoWithdrawal(uint256 withdrawal) onlyNceno public payable{
        
        nceno.transfer(withdrawal);
    }

}
//end of GoalFactory contract