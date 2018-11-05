pragma solidity ^0.4.18;
//Author: Joe Nance
//Title: Nceno goal struct

//Description: this is an attempt to combine deployment and deposit into a single contract.



contract NcenoGoals {
  
  
  //make a record for each player of their goals
  struct PlayerGoalHistory{
     address[] hostedGoals;
    }
  
  //make a registry of all goals, accessible by a fitbitID
  mapping (uint => Goal) goalsByFitbit;
  address[] goalList;

  

//spawn a new goal with intended parameters
  function createGoal(bytes32 _name, bytes32 _email, uint _fitbitID,uint _activeMinutes, uint _rounds,bytes16 _beginAt, uint _stake) public {
      
      address creator = msg.sender;
      createdGoal = new PocGoal(creator, _name,_email,_fitbitID,_activeMinutes,_rounds,_beginAt, _stake);
      //add it to the registry
      goalList.push(createdGoal);
      //add it to the player's history
      goalsByFitbit[_fitbitID].hostedGoals.push(createdGoal);
    }
  
  //get the address of the most recently created goal
  //function getContractAddress() public constant returns (address) {
      //return address(createdGoal);
    //}


  
 //lookup function. Given a fitbitID, return a list of all goals associated to it.
  function getGoalsByFitbitID(uint _fbID) view public returns (address []) {   
        return goalsByFitbit[_fbID].hostedGoals;
    }
    
  //lookup function. Given a fitbitID, returns the address of the last goal deployed by it.
  function getLastGoalByFitbitID(uint _fbID) view public returns (address ) {   
        uint theLast = goalsByFitbit[_fbID].hostedGoals.length -1;
        return goalsByFitbit[_fbID].hostedGoals[theLast];
    }

    
}
//end of GoalFactory contract



