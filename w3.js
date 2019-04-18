
//var PortisProvider = window.Portis.PortisProvider;
const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'ropsten');
const web3 = new Web3(portis.provider);

// Check if Web3 has been injected by the browser (Mist/MetaMask)

//if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  //web3 = new Web3(web3.currentProvider);
//} else {
	// Fallback - use Portis
    /*web3 = new Web3(new PortisProvider({
      apiKey: "332bfe3ea28174fa515d478e23a1b31c",
      network: 'ropsten'
    }));*/
//}

//old method to initialize from wallet close
/*function showPortis() {
  // will only open the portis menu
  portis.showPortis(() => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      //web3.eth.defaultAccount = '0x0b51bde2ee3ca800e9f368f2b3807a0d212b711a';
      console.log("default: " + web3.eth.defaultAccount);
      localize();
      authed = true;
      getToken();
      $("#portisBtn").hide();
      $("#portisSuccess").html("Wallet address: "+web3.eth.defaultAccount.slice(0, 22)+" "+web3.eth.defaultAccount.slice(23, 42));
    });
  });
}*/
