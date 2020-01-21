const hrThresh = 99;
function getActivities(){
  $('#payMeBtn').hide();
  $('#logLoader').show();
  
  //gets the original goal parameters
  var goalMovingTime;
  Nceno.methods.getGoalParams(goalid)
  .call({from: web3.eth.defaultAccount},
      function(error, result) {
      if (!error){
        goalMovingTime = result[0];
      }
      else
      console.error(error);
  });

  //check the day's activities
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {

      //list the workouts of the day
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      
      //clean the data and make a list of valid workouts.
      var cleaned = new Array();
      let i=0;
      let k=0;
      while(i<data.length){
        if(data[i].manual == false && data[i].has_heartrate == true && data[i].average_heartrate>hrThresh && data[i].elapsed_time/60>=goalMovingTime){
          
          //create new entry in cleaned[][]
          cleaned[k] = [data[i].id, data[i].average_heartrate, data[i].elapsed_time/60];
          k++;
        }
        i++;
      }

      //echo the cleaned and valid workouts
      console.log("cleaned length is: "+cleaned.length);
      console.log(cleaned);
      
      //if there is at least one valid workout, log it in the contract, triggering payout.
      if(cleaned.length>0){
        console.log("Good news, your workout is being logged for a payout!");
        console.log(goalid+","+stravaID+","+ cleaned[0][0]+","+Math.round(cleaned[0][1])+","+Math.round(cleaned[0][2]));
             

              //************** could insert gap detection here and re-clean  *********
              //************** change cleaned[0][0] to recleaned[0][0] ***************
        var gapCleaned = new Array();
        let u=0;
        let p=0;
        //loop through the cleaned activity IDs, 
        //call the heartrate stream, 
        //do gap detection, 
        //return the adjusted heartrate, 
        //check against threshhold, 
        //if ok then store it and log
        //else go to the next one
        //if length is 0, then show error
        while(u<cleaned.length){
          gapDetect(cleaned[u][0])
          if(adjusted > hrThresh){
            dosomething;
            p++;
          }
          u++
        }


        //log the data to get a payout
        Nceno.methods.log(
          goalid,
          stravaID,
          cleaned[0][0],
          Math.round(cleaned[0][1]),
          Math.round(cleaned[0][2])
        )
        .send({from: web3.eth.defaultAccount, nonce: correctNonce, gas: 300000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
          function(error, result) {
            if (!error){
              console.log(result);
            }
            else
            console.error(error);
          }
        ).once('confirmation', function(confNumber, receipt, result){
          console.log(receipt.status);
          if(receipt.status === true){
            
            //----------event listener
            var usdPayout;
            Nceno.events.Log({
              filter: {_goalID: goalid, _stravaID: stravaID},
              fromBlock: 0, toBlock: 'latest'
            }, (error, event) => { 
                console.log(event);
                usdPayout = parseInt(event.returnValues._payout)/1000000000000000000;
                console.log("payout was: $"+usdPayout.toFixed(2));
                //----begin other messages

                $('#logEcho').html('<p>Your workout: Avg heart rate was '+Math.round(cleaned[0][1])+ 'bpm, Session length was '+Math.round(cleaned[0][2])+'mins.</p>');
                
                if(usdPayout!=0){
                  $('#logSuccess').html('<p style="color:white;">Great job, you just earned back $'+usdPayout.toFixed(2)+' of your stake! Check your wallet.</p>');
                  $('#logSuccess').show();
                }
                else{
                  $('#logLoader').hide();
                  $('#getYouPaid').hide();
                  $('#logFail').html('<p>Good job, but no payout for this one... You already logged a workout today.</p>');
                }
                //----end other messages
            })
            .on('error', console.error);
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
        if(cleaned.length<1){
          console.log("No valid workouts today..."+cleaned.length);
          //if no valid workouts, don't log, and alert the user.
          $('#getYouPaid').hide();
          $('#logLoader').hide();
          //$('#logFail').show();
          $('#logFail').html('<p>You don’t have any valid workouts today. </p>');
        }
        else if(cleaned.length>0){
          console.log("No valid workouts.. You paused for a significant portion of your workout.")
          //if no valid workouts, don't log, and alert the user.
          $('#getYouPaid').hide();
          $('#logLoader').hide();
          //$('#logFail').show();
          $('#logFail').html('<p>No valid workouts.. You paused for a significant portion of your workout. </p>');
        }
      } 
    }
  });

  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}

var actID = 2719149178;
function getRawHR(){
  var stuff2 = null;
  var xhr2 = new XMLHttpRequest();
  xhr2.withCredentials = true;
  xhr2.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      //console.log(this.responseText);
      var resp2 = JSON.parse(xhr2.responseText);
      var hr = resp2.heartrate.data;
      var tm = resp2.time.data;
      var dataString='';
      var plot = new Array();
      for(let u=0; u<hr.length; u++){
        plot[u]=[tm[u],hr[u]];
        dataString=dataString+'{'+plot[u]+'},';
      }
      var hrdata=dataString.slice(0, -1);
      console.log(hrdata);

      //----- gap detection -----
      var gap = 0;
      for(let s=0; s<tm.length+1; s++){
        var diff = tm[s+1]-tm[s];
        if(diff>=10){
          gap+=diff;
        }
      }
      var activeTime = (1.0*tm[tm.length-1]-gap);
      var pl = 0;
      for(let r=0; r<hr.length; r++){
        pl +=hr[r];
      }
      var avghr = pl/hr.length;
      var adjHR = (avghr*activeTime + 80*gap)/tm[tm.length-1];

      console.log("total gap is: "+gap/60+" min");
      console.log("real active time is: "+activeTime/60+" min");
      console.log("adjusted HR is: "+adjHR+" BPM");

      //throw error if gap it too large
      if(gap > 0.17*tm[tm.length-1]){
        console.log("you paused for a significant portion of your workout. ("+gap+" seconds = "+(100*gap/tm[tm.length-1])+"%)");
        //and then test the next workout
      }
      //---- /gap detection -----

    }
    else{
      console.log("ERROR: gap detection failed."); 
    } 
  });
  xhr2.open("GET", 'https://www.strava.com/api/v3/activities/'+actID+'/streams?keys=heartrate,time&series_type=time&key_by_type=true');
  xhr2.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr2.send(stuff2);
}

function createUser(){
  localize();
  Nceno.methods.userExists(
    stravaID
  )
  .call({from: web3.eth.defaultAccount},
    function(error, result){
      if (!error){
        if(result!=true){
          Nceno.methods.makeProfile(
          stravaID,
          web3.utils.padRight(web3.utils.toHex(stravaUsername),34),
          web3.utils.padRight(web3.utils.toHex(flag),34),
          OS,
          web3.utils.padRight(web3.utils.toHex(portisEmail),34))
          .send({from: web3.eth.defaultAccount, gas: 400000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
          function(error, result) {
            if (!error){
              console.log(result);
            }
            else
            console.error(error);
          }
          );
        }
      }
      else
      console.error(error);
    }
  );
}
