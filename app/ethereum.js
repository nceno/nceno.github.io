//<script>

  /*var PortisProvider = require('portis').PortisProvider;
  var Web3 = require('web3');
  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
  } else {
      // Fallback - use Portis
      web3 = new Web3(new PortisProvider({
      apiKey: "332bfe3ea28174fa515d478e23a1b31c",
      network: 'rinkeby'
      }));
    }
    */
    var Web3 = require('../web3');
    web3 = new Web3(web3.currentProvider); //for cipher, status, or metamask
    web3.eth.defaultAccount = web3.eth.accounts[0];
    var NcenoContract = web3.eth.contract(NcenoABI);

        var Nceno = NcenoContract.at('0xe9390c922503b98da5785e57616739379a26a699'); //mainnet from metamask account 2
        //var Nceno = NcenoContract.at('0x22b51c7a64510780dad13fb2cd1c868476060447'); //rinkeby from metamask account 2
        
        console.log(Nceno);
        
        $("#modalCreateBtn").hide();
        
        //show create button only if user agrees to terms
        $("#checker").on('click', function() {
          if($("#checker").is(':checked')) {
            $("#modalCreateBtn").show();
            
          } else {
            $("#modalCreateBtn").hide();
            
          }
        });

         ///////////////call fitbit api with user creds
        //getting the access token from url
        var access_token = window.location.href.split('#')[1].split('=')[1].split('&')[0];

        // get the userID
        var userID = window.location.href.split('#')[1].split('=')[2].split('&')[0];

        console.log(access_token);
        console.log(userID);
        //event listener for goal creation
        var goalInfoEvent = Nceno.goalInfo({},'latest');
        
        goalInfoEvent.watch(function(error, result){
            if (result)
                {
                    if (result.blockHash != $("#insTrans").html()) //when the creation txn is mined, and goal spawned
                      console.log(result.blockHash);
                      //loader hide
                      $("#loader").hide();
                      //echo goal creation
                      $("#goalDisplay").html(web3.toAscii(result.args.name) + ' just made a goal!');

                      //show data
                      $("#yourGoal").show();
                      //echo goal data
                      $("#yourGoal").html(web3.toAscii(result.args.name)+' at '+web3.toAscii(result.args.email)+ 
                        ' just committed to doing '+ result.args.rounds+ ' x '+ result.args.activeMinutes+ 
                        ' minute exercise sessions each week for 4 weeks, beginning from '+ web3.toAscii(result.args.beginAt)+ 
                        ', with a stake of $'+ ($("#stake").val()-1)+ ' USD!');
                      //link to log workouts
                      $("#allSet").show();
                    } else {
                    $("#loader").hide();
                    console.log(error);
                }
        });
       

//creating the goal
$("#createBtn").click(function() {
  var usdStake = ($("#stake").val()-1.05)*0.0057;
  Nceno.createGoal(
    $("#name").val(),
    $("#email").val(), 
    //('1'+$("#fitbitID").val()),
    userID, 
    $("#activeMinutes").val(), 
    $("#rounds").val(), 
    ('Beginning/ '+$("#beginAt").val()), 
    //$("#stake").val(),
    web3.toWei(usdStake, "ether"),
    {from: web3.eth.accounts[0], gas: 500000, gasPrice: 12000000000, value: web3.toWei(usdStake, "ether")},
    function(error, result) {
      if (!error){
        $("#createBtn").hide();
        $("#loader").show();
        $("#insTrans").html(result.blockHash);
        console.log(result);
      }
      else
      console.error(error);
    }
  )
}); 
       

$("#logBtn").click(function() {
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.fitbit.com/1/user/'+ userID +'/activities/heart/date/today/1d.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function() {
   if (xhr.status === 200) {
      //console.log(xhr.responseText);
      //document.write(xhr.responseText);
      
      var data = JSON.parse(xhr.responseText);
      var obj = [data];
      var fatBurn = obj[0]["activities-heart"][0].value.heartRateZones[1].minutes;
      var cardio = obj[0]["activities-heart"][0].value.heartRateZones[2].minutes;
      var peak = obj[0]["activities-heart"][0].value.heartRateZones[3].minutes;
      var formattedTime = Date.parse(obj[0]["activities-heart"][0].dateTime)/1000;

      console.log(userID +"'s active minutes for "+ obj[0]["activities-heart"][0].dateTime);
      console.log(obj[0]["activities-heart"][0].value.heartRateZones[1].minutes);
      console.log(obj[0]["activities-heart"][0].value.heartRateZones[2].minutes);
      console.log(obj[0]["activities-heart"][0].value.heartRateZones[3].minutes);
      console.log("time stamp: "+formattedTime);

      var sessionMins = fatBurn + cardio + peak;
      console.log("total session minutes to be logged: "+sessionMins);

    
      Nceno.simplePayout(
                userID, 
                sessionMins,
                formattedTime+2,
                {from: web3.eth.accounts[0], gas: 60000, gasPrice: 5000000000},
                function(error, result) {
                    if (!error){
                      //echo the result and do some jquery loader stuff
                    }
                      else
                      console.error(error);
                })//close contract function call
    }
};
xhr.send()
});//close click(function(){


    //</script>
