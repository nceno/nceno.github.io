async function makeItRain(){
	Nceno.methods.getGoalCount()
	.call({from: web3.eth.defaultAccount},function(error, result) {
		if (!error){
			for(let i = 0; i++; i<result){
				var cashout = await Nceno.methods.liquidateGoalInstance(i)
				.call({from: web3.eth.defaultAccount},
			      function(error, result) {
			      	if (!error){
			      		//do something
			      	}
			    });
			}
		}
	});
}