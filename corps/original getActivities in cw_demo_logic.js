function getActivities(){
  $('#payMeBtn').hide();
  $('#logLoader').show();
  var goalMovingTime = 19;

  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function(){
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      //clean the data and make a list of valid workouts.
      var cleaned = new Array();

      let i=0;
      let k=0;
      console.log("data[0]= "+data[0]);
      while(i<data.length){
        if(data[i].manual == false && data[i].moving_time/60>=goalMovingTime){
          cleaned[k] = [data[i].id, data[i].moving_time/60];
          //cleaned.push([data[i].id, data[i].average_heartrate, data[i].moving_time/60]);
          //console.log("added: ["+cleaned[i]+"]");
          k++;
        }
        i++;
      }

      //sorting algo
      /* var arrayMaxIndex = function(array) {
        return array.indexOf(Math.max.apply(null, array));
      };
      console.log(arrayMaxIndex([1,2,7,2])); //outputs 2*/

      console.log("cleaned length is: "+cleaned.length);
      console.log(cleaned);
      //if there is at least one valid workout, log it in the contract, triggering payout.
      if(cleaned.length>0){
        
        console.log("Good news, your workout is being logged for a payout!");
        console.log(goalid+","+stravaID+","+ cleaned[0][0]+","+Math.round(cleaned[0][1])+","+Math.round(cleaned[0][2]));
        

        //log the data to get a payout
        NcenoBrands.methods.log(
          goalid,
          //$('#goalCategories').val();
          stravaID,
          cleaned[0][0],
          Math.round(cleaned[0][1]),
          Math.round(cleaned[0][2])
        )
        .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 300000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
          function(error, result) {
            if (!error){
              /*$("#joinSearch").hide();
              $("#srCancelBtn").hide();
              $("#joinLoader").show();*/
              console.log(result);
            }
            else
            console.error(error);
          }
          //start here left off pick up here
        ).once('confirmation', function(confNumber, receipt, result){
          console.log(receipt.status);
          console.log(receipt);
          if(receipt.status === true){
            $('#logLoader').hide();
            console.log("payout is: "+receipt.events.Log.returnValues['_payout']);
            
            //----------event listener
            var usdPayout = receipt.events.Log.returnValues['_payout']/1000000000000000000;
            var loggedHR = receipt.events.Log.returnValues['_avgHR']
            var loggedMins = receipt.events.Log.returnValues['_reportedMins']
            //-----/


                $('#logEcho').html('<p>Your workout: Avg heart rate was '+loggedHR+ 'bpm, Session length was '+loggedMins+'mins.</p>');
                
                if(usdPayout>0){
                  //$('#logSuccess').html('<p style="color:white;">Great job, you just earned back some of your stake! Check your wallet in a bit.</p>');
                  $('#logSuccess').html('<p style="color:white;">Great job, you just earned back $'+usdPayout.toFixed(2)+' of your stake! Check your wallet.</p>');
                  $('#logSuccess').show();
                  makeWktl();
                }
                else{
                  $('#logLoader').hide();
                  $('#getYouPaid').hide();
                  $('#logFail').html('<p>Good job, but no payout for this one... You already logged this workout today.</p>');
                }
                //----end other messages
            //})
            //.on('error', console.error);
            //--------/end event listener

            $('#logLoader').hide();
            $('#getYouPaid').hide();
            correctNonce++;
            
          }
          else{
            $('#logLoader').hide();
            $('#getYouPaid').hide();
            $('#logFail').html('<p>"wallet mismatch, user is not competitor, goal has not started , or goal has finished.</p>');
            console.log("wallet-user mismatch, user is not competitor, goal has not started yet, or goal has already finished.");
          } 
        })
        .once('error', function(error){console.log(error);});;
      }
      else{
        console.log("No valid workouts today..."+cleaned.length);
        //if no valid workouts, don't log, and alert the user.
        $('#getYouPaid').hide();
        $('#logLoader').hide();
        //$('#logFail').show();
        $('#logFail').html('<p>You don’t have any valid workouts today. </p>');

      } 
    }
  });

  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}