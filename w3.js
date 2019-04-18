
var PortisProvider = window.Portis.PortisProvider;
// Check if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(web3.currentProvider);
} else {
    // Fallback - use Portis
    web3 = new Web3(new PortisProvider({
      apiKey: "332bfe3ea28174fa515d478e23a1b31c",
      network: 'ropsten'
    }));
}