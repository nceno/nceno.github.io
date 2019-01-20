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



//joining a goal
$("#joinPopup[i]").click(function() {
var goalid = web3.utils.padRight($("colGoal[i]").val(),34)
  Nceno.methods.getGoalParams(goalid)
  .call({from: web3.eth.defaultAccount},
    function(error, result) {
      if (!error){
        Nceno.methods.simplePayout(goalid, userID).send(
        {from: web3.eth.defaultAccount, gas: 3000000, gasPrice: 15000000000, value: result[1]},
          function(error, result) {
            if (!error){
              $("#joinPopup").hide();
              console.log(result);
            }
            else
            console.error(error);
          });
      }
      else
      console.error(error);
    }
  );
});