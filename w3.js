
//var PortisProvider = window.Portis.PortisProvider;
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'ropsten');

// Check if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(web3.currentProvider);
} else {
	const web3 = new Web3(portis.provider);
    // Fallback - use Portis
    /*web3 = new Web3(new PortisProvider({
      apiKey: "332bfe3ea28174fa515d478e23a1b31c",
      network: 'ropsten'
    }));*/
}