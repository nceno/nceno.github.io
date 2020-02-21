async function loadCodes(dict){
	var w = 10; //number of codes in a set
	var sets = dict.length/w //= number of sets of w codes
	for(let i=0; i<sets; i++){
		await NcenoBrands.methods.addInviteCodes(
			_goalID,
			dict.slice(i*w,i*w+(w-1))
		).send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
		  async function(error, result) {
		    if (!error){
		 			await console.log(result);
		    }
		    else
		    console.error(error);
		  }
			).once('confirmation', async function(confNumber, receipt){
		  	console.log(receipt.status);
		  	if(receipt.status == true){
		    	correctNonce++;
		    	await console.log(receipt.status);
		  	}
		  	else{
		    	console.log('error loading codes.');
		  	}
		});
	}
}