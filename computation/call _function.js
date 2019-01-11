//creating a goal
//Date.now()/1000,
var usdStake = ($("#stakeDD").val()-2)*0.0048;
$("#hostBtn").click(function() {
  Nceno.methods.createGoal(
    web3.utils.randomHex(32),
    $("#activeMinsDD").val(),
    web3.utils.toWei(usdStake, "ether"),
    $("#sesPerWkDD").val(),
    $("#wksDD").val(),
    $("#datetimepicker1").val(),
    userID
  )
  .send({from: web3.eth.defaultAccount, gas: 5000000, gasPrice: 15000000000},
    function(error, result) {
      if (!error){
        $("#hostBtn").hide();
        $("#goalEcho").html("You're commiting $" + $("#stakeDD").val() + "to working out for " + $("#activeMinsDD").val() +"mins " + $("#sesPerWkDD").val()+" times per week for "+ $("#wksDD").val()+" weeks, starting automatically at "+ $("#datetimepicker1").val()+".");
        console.log(result);
      }
      else
      console.error(error);
    }
  );
});