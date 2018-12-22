



//the function used to claim the bonus from lost stake of the previous week
function claim(string goalID){
	//require isCompetitor=true

	//must have 100% adherence for the previous week, and can only claim once.
	require(msg.sender.progress[wk]==rounds && msg.sender.bonusPaid[wk] != true)
	msg.sender.transfer(pot[wk-1]/(2*winners[wk-1]));
}

//the function used to join a challenge, if you know the goalID
function join(string goalID) payable{
	//copy all the goal parameters and deposit the stake

	//add caller's ID to the competitor list, increase the competitorCount	
}