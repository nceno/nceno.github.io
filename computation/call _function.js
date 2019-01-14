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
    var i = 0;
    var goals = new Array();

    for (i = 0; i < 3; i++){
      Nceno.methods.getActiveGoal(userID, i).call({from: web3.eth.defaultAccount}, function(error, result){
        goals[i] = result;
        console.log(goals[i]);
        $("#chIDtools").append('<option>'+ goals[i] +'</option>');
      });    
    }
    populated = true;
  }
}