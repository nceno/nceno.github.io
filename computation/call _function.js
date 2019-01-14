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

function makeList(){
  var count = Nceno.methods.profileOf[userID].goalTotal.call();
  var i;
  //var goals = new Array();
  for (i = 0; i < count; i++){
    //goals[i] = Nceno.methods.profileOf[userID].goalAt[i].goalID.call();
    $("#chIDtools").append('<option>'+ Nceno.methods.profileOf[userID].goalAt[i].goalID.call() +'</option>');
  }
  else
  console.error(error);
}