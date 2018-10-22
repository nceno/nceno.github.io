//sending ether to the goal just created
        $("#depositBtn").click(function() {
            //>>>>call a function, and use jquery (optional)
            var spawnAddress = GoalFactory.getLastGoalByFitbitID($("#fitbitID").val(),
                function(error, result) {
                    if (!error){
                        var SpawnedGoal = PocGoalContract.at('spawnAddress');
                        SpawnedGoal.deposit(
                        //params
                        //the required callback (last parameter)
                        //,
                        function(err, result) {
                            if (!err)
                                console.log(result);
                            else
                                console.error(error);
                        });
                    }
                    else
                        console.error(error);
                });

        });


//echo contract as html print
$("#depositStakeBtn").click(function() {
          PocGoal.getGoal(
            function(error, result) {
              if (!error){
                $("#goalDisplay").html('owner address: '+result[0]+' '+result[1]+' '+result[2]+' '+result[3]+' '+result[4]+' '+result[5]+' '+result[6]+' '+result[7]+' '+result[8]+' '+result[9]+' '+result[10]+' '+result[11]);
                console.log(result);
              }//close if
              else
                console.error(error);
            }//closes callback
          )//closes contract function call
        });//closes function(){ and click(
        //end of function call by button click