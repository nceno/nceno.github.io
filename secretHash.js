//get the most recent block number
web3.eth.getBlock("latest")
.then(latestNum = result.number);

//set a secret block number derived from the most recent and the current time
var secretIndex = 0;
while(secretIndex <1){
 secretIndex = latestNum - new Date().getTime().slice(-1);
}

//get that block's hash 
//!!!!!security step!!!!!!
web3.eth.getBlock(secretIndex)
.then(secretHash = web3.utils.soliditySha3(result.hash));

//send the secret index and the hash
//(..., secretIndex, secretHash).send(....);

//on-chain ..need keccak to compare strings
require(sha3(blockhash(secretIndex)) == secretHash);