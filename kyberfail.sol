pragma solidity ^0.4.24;
import "./ERC20Interface.sol";
import "./KyberNetworkProxy.sol";

contract Demo{

	function Demo(KyberNetworkProxy _kyberNetworkProxyContract) public {
    	kyberNetworkProxyContract = _kyberNetworkProxyContract;
  	}
	//Assuming msg.value is sufficient, this function swaps the sent ether, for a maximum of "_dollars" worth of DAI
	function exchangeETHforDAI(uint _dollars) public{
		executeSwap(ETH_ERC20, msg.value, DAI_ERC20, msg.sender, _dollars*(10**18));
	}

	//************
	// MY PROBLEMS:
	//
	// 1) There is a type error when I compile if I pass in the un-casted token (i.e. DAI_ERC20_Address instead of DAI_ERC20).
	//		Passing the casted version compiles fine.
	// 2) Once the contract is deployed inside of Remix, calling the function with reasonable 
	//		"msg.value"=82485875706214690 and "_dollars"=20 parameters gives the error 
	//			"gas required exceeds allowance (6000000) or always failing transaction".
	//
	//	I can call "getConversionRates()" and it returns values just fine (the exchange rate is off, but it's the testnet afterall.)
	//		I have included all of the required contract dependencies...
	//		 	What could be the reason why this txn would always fail?
	//************


	//--------------------------
	//vars and functions required by Kyber docs---------------
	//--------------------------

	//falback function
	function() public payable {}

	//copied directly from the docs
	function getConversionRates(ERC20 srcToken, uint srcQty, ERC20 destToken) public view returns (uint, uint){
    	return kyberNetworkProxyContract.getExpectedRate(srcToken, destToken, srcQty);
  	}

  	//copied directly from the docs (comments omitted), used above
  	function executeSwap(ERC20 srcToken, uint srcQty, ERC20 destToken, address destAddress, uint maxDestAmount) public {
    	uint minConversionRate;
	    require(srcToken.transferFrom(msg.sender, address(this), srcQty));
	    require(srcToken.approve(address(kyberNetworkProxyContract), 0));
	    require(srcToken.approve(address(kyberNetworkProxyContract), srcQty));
	    (minConversionRate,) = kyberNetworkProxyContract.getExpectedRate(srcToken, destToken, srcQty);
	    kyberNetworkProxyContract.trade(srcToken, srcQty, destToken, destAddress, maxDestAmount, minConversionRate, 0);
	    Swap(msg.sender, srcToken, destToken);
  	}

  	//required addresses of tokens
  	address ETH_ERC20_Address = 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee;//eth proxy, 18 decimals
  	address DAI_ERC20_Address = 0xaD6D458402F60fD3Bd25163575031ACDce07538D;//ropsten, 18 decimals
  	address KyberNetworkProxy_Address = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755;

  	//cast the token addresses as ERC20
  	ERC20 public ETH_ERC20 = ERC20(ETH_ERC20_Address); //kyber ether proxy
  	ERC20 public DAI_ERC20 = ERC20(DAI_ERC20_Address);
  	
  	//copied directly from the docs
  	event Swap(address indexed sender, ERC20 srcToken, ERC20 destToken); 
  	KyberNetworkProxy public kyberNetworkProxyContract; 
	
	//--------------------------
	//-- end/   vars and functions required by Kyber docs---------------
	//--------------------------
}