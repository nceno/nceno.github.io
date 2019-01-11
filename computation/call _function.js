//calling a function
$("#BUTTON").click(function() {
  //var usdStake = ($("#stake").val()-1.05)*0.0057;
  CONTRACT.FUNCTION(
    $("#ELEMENT ID").val(),
    GLOBALVAR,
    ('TXTPADDING'+$("#ELEMENT ID").val()), 
    //$("#stake").val(),
    //web3.toWei(usdStake, "ether"),
    {from: web3.eth.accounts[0], gas: GASLIMIT, gasPrice: XX000000000, value: web3.toWei(usdStake, "ether")},
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



//creating a competitor account
$("#makeAcctBtn").click(function() {
  Nceno.createCompetitor(
    userID,
    $("#wearable").val(),
    $("#name").val(),
    $("#email").val(),
    {from: web3.eth.accounts[0], gas: 8000000, gasPrice: 21000000000},
    function(error, result) {
      if (!error){
        $("#makeAcctBtn").hide();
        $("#loader").show();
        $("#insTrans").html(result.blockHash);
        console.log(result);
      }
      else
      console.error(error);
    }
  )
}); 


//waiting for it to be mined
var profileCreatedEvent = Nceno.profileCreated({},'latest');
        profileCreatedEvent.watch(function(error, result){
            if (result)
                {
                  if (result.blockHash != $("#insTrans").html()) //when the creation txn is mined, and goal spawned
                    console.log(result.blockHash);
                    //loader hide
                    $("#loader").hide();
                    //echo goal creation
                    $("#profCre").html('Success!'+ web3.toAscii(result.args._name) );
                } else {
                    $("#loader").hide();
                    console.log(error);
                  }
        });