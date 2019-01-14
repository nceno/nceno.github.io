//creating a goal
var usdStake = $("#stakeDD").val()*0.0087;
$("#hostBtn").click(function() {
  Nceno.methods.createGoal(
    goalID,
    $("#activeMinsDD").val(),
    web3.utils.toWei(usdStake, "ether"),
    $("#sesPerWkDD").val(),
    $("#wksDD").val(),
    $("#datetimepicker1").datetimepicker('date'),
    userID
  )
  .send({from: web3.eth.defaultAccount, gas: 5000000, gasPrice: 15000000000, value: usdStake},
    function(error, result) {
      if (!error){
        $("#hostBtn").hide();
        console.log(result);
      }
      else
      console.error(error);
    }
  );
});

var populated = false;
function makeList(){
    //makes a list of active goals for a user
    if(populated = false){
      var count;
      Nceno.methods.profileOf[userID].goalTotal.call({from: web3.eth.defaultAccount}, function(error, result){count = result});
      var i = 0;
      var goals = new Array();
      console.log(count, web3.eth.defaultAccount); //debug
      for (i = 0; i < count; i++){
        Nceno.methods.profileOf[userID].goalAt[i].goalID.call({from: web3.eth.defaultAccount}, function(error, result){goals[i] = result});
        console.log(goals[i]); //debug
        $("#chIDtools").append('<option>'+ goals[i] +'</option>');
      }
      populated = true;
    }
  }