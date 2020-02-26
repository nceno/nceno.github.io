console.log("4444");

for(let n=1; n<5; n++){
  $('#companyTitle'+n).html('<font style="color:#999;">'+companyName+'</font>');
}

///////////////////////////////////////
//////////////vvvvvvvvv getActivities()
///////////////////////////////////////

var speedLimit = 4.5; //in m/s
var speedLow = 1.4; //in m/s
var BPMthresh = 99; 
var sesLow = 1200; //in s
var HRreward; //loaded from page .onload
var KMreward; //loaded from page .onload
var placeholderDate = new Date();
placeholderDate.setDate(placeholderDate.getDate() - 30); //can change "1" day to "20" days for testing.
var yesterday =parseInt(parseInt(placeholderDate.getTime())/1000);
var nowDate = parseInt(parseInt(new Date().getTime())/1000);

var HR = new Array();  //HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
var GPS = new Array(); //GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
var toLog = new Array(3);

//HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
//GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
var data = new Object();

let i=0;
let j=0;
let k=0;

var GPSMaxID = null;
var GPSMaxVal=0;
var avgSpeedMax = 0;
var distMax = 0;
var timestampMax = null;

var hrMaxID = null;
var hrMaxVal=0;
var avgHRmax = 0;
var elapsed_timeMax = 0;

var bestID = null;
var bestVal = 0;
var identifier = null;

var dispHR;
var dispMins;
var dispTimeHours;
var dispTimeMinutes;
var dispSpeed;
var dispDist;
var dispValue;
var period;

async function makeActivities(){
  //---- Get the activities, clean them, and separate them into HR and GPS
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  await xhr.addEventListener("readystatechange", async function(){
    if (this.readyState === 4) {
      console.log(this.responseText);
      data = await JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      //clean the data and make a list of valid workouts.   
      if(data.length <1) console.log("no workouts today.");
      //HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
      //GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
      while(i<data.length){
        if(data[i].manual == false && data[i].has_heartrate == true){
          var HRvalid= false;
          if(data[i].average_heartrate>BPMthresh && data[i].elapsed_time>sesLow) {HRvalid =true;}
          HR.push([data[i].id, data[i].average_heartrate, data[i].elapsed_time, data[i].start_date, Math.floor(HRreward*data[i].elapsed_time/600), HRvalid]); //need to adjust time, hr, value, validity
          j++;
        }
        if(data[i].manual == false && data[i].distance > 0){
          var GPSvalid= false;
          if(data[i].distance>1000 && data[i].average_speed<speedLimit && data[i].average_speed>speedLow) {GPSvalid =true;}
          GPS.push([data[i].id, data[i].average_speed, data[i].distance, data[i].start_date, Math.floor(KMreward*data[i].distance/1000), GPSvalid]);
          k++;
        }
        else if(data[i].manual == false && data[i].has_heartrate == false && (data[i].distance == 0 || data[i].distance == null)){
          console.log("No valid workouts today...");
        }
        i++;
      }

      //echo the workouts
      console.log("the "+k+" GPS workouts are: ");
      console.table(GPS);
      console.log("the "+j+" HR workouts are: ");
      console.table(HR);

      
      //GPS: ID0, avgSpeed1, dist2, timestamp3, reward4, valid5

      //loop through GPS[m] to find max
      if(k>0){
        GPS.forEach(function(_G){
          if(_G[5]==true && _G[4]>GPSMaxVal){
            GPSMaxID = _G[0]; //<--- maybe the ID's collide if workout has both data?
            GPSMaxVal=_G[4];
          }
        });
      }

    }
    //else console.log("access_token is too old.");
  });
  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
  xhr.send(stuff);
}

///////////////////////////////////////
//////////////^^^^^^^^^^^ getActivities()
///////////////////////////////////////


///////////////////////////////////////
//////////////vvvvvvvvvvv gapAdjust()
///////////////////////////////////////
function gapAdjust(){
  HR.forEach(async function(_H){
    var adjHR;
    var activeTime;

    var stuff2 = null;
    var xhr2 = new XMLHttpRequest();
    xhr2.withCredentials = false;
    await xhr2.addEventListener("readystatechange", async function () {
      if (this.readyState === 4) {
        var resp = await JSON.parse(xhr2.responseText);
        var hr = resp.heartrate.data;
        var tm = resp.time.data;
        
        //----- gap detection -----
        var gap = 0;
        for(let s=0; s<tm.length+1; s++){
          var diff = tm[s+1]-tm[s];
          if(diff>=10){
            gap+=diff;
          }
        }

        //activeTime will replace elapsed_time
        activeTime = (1.0*tm[tm.length-1]-gap);
        var pl = 0;
        for(let r=0; r<hr.length; r++){
          pl +=hr[r];
        }
        var avghr = pl/hr.length;

        //adjHR will replace avgHR
        adjHR = (avghr*activeTime + 80*gap)/tm[tm.length-1];

        console.log("total gap is: "+gap/60+" min");
        console.log("real active time is: "+activeTime/60+" min");
        console.log("adjusted HR is: "+adjHR+" BPM");

        //this is the HR update step.....
        //HR:  ID0, avgHR1,    mins2, timestamp3, reward4, valid5
        
        _H[1]=adjHR;
        _H[2]=activeTime;
        _H[4]= Math.round(HRreward*activeTime/600);

        data.forEach(function(act){
          if (act.id == _H[0]){
            act.elapsed_time = activeTime;
            act.average_heartrate = adjHR;
          }
        });

        //---- /gap detection -----
      } 
    });
    xhr2.open("GET", 'https://www.strava.com/api/v3/activities/'+_H[0]+'/streams?keys=heartrate,time&series_type=time&key_by_type=true');
    xhr2.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
    xhr2.send(stuff2);
  });
}


///////////////////////////////////////
//////////////^^^^^^ gapAdjust()
///////////////////////////////////////


///////////////////////////////////////
//////////////vvvvvvvvv find best and show in UI
///////////////////////////////////////

function showBest(){
  //find the max HR workout
  if(j>0){
    HR.forEach(function(_H){
      if(_H[5]==true && _H[4]>hrMaxVal){
        hrMaxID = _H[0];
        hrMaxVal=_H[4];
      }
    });
  }

  //compare the max values and return the id of the best one
  if(GPSMaxVal>=hrMaxVal){
    bestVal = GPSMaxVal;
    bestID = GPSMaxID;
    identifier = "GPS";
    //hide bmp mins
  }
  else {
    bestVal = hrMaxVal;
    bestID = hrMaxID;
    identifier = "HR";
  }
  console.log("the best one is a "+identifier+" workout: "+bestID+", which is worth "+Math.round(bestVal)+" SUN tokens");

  //get the full details of that activity
  data.forEach(function(_A){
    if(_A.id==bestID){
      //console.log(_A);

      dispTimeHours = new Date(_A.start_date).getHours()//-_A.utc_offset/3600;  may need to use start_date_local
      if(dispTimeHours%12>=0){
        if(dispTimeHours%12==0){
          dispTimeHours = 12;
        }
        else {dispTimeHours = dispTimeHours%12;}
        period = "pm";
      }
      else{
        period = "am";
      }

      dispHR = _A.average_heartrate; //needs to be adjusted
      
      dispMins = _A.elapsed_time; //needs adjusted
      
      dispValue = Math.round(bestVal); //needs adjusted

      //_A.utc_offset/3600

      dispTimeMinutes = new Date(_A.start_date_local).getMinutes();
      if(dispTimeMinutes<10){dispTimeMinutes = "0"+dispTimeMinutes;}
      dispSpeed = _A.average_speed;
      dispDist = _A.distance;
      
    }
  });
  //console.log("display this: "+dispTime+" "+dispMins+" "+dispHR+" "+dispDist+" "+dispSpeed+" "+dispValue);
  if(dispHR!= null && dispHR!= 0) $("#dispHR").html(Math.round(dispHR)); 
  if(dispMins!= null && dispMins!= null && dispHR!= null ) $("#dispMins").html(Math.round(dispMins/60));
  $("#dispTime").html(dispTimeHours+':'+dispTimeMinutes);
  $("#period").html(period); 
  if(dispSpeed!= null && dispSpeed!= 0) $("#dispSpeed").html((dispSpeed*3.6).toFixed(1));
  if(dispDist!= null && dispDist!= 0) $("#dispDist").html((dispDist/1000).toFixed(1)); 
  $("#dispValue").html(dispValue);

  //make the thing to be logged
  toLog[0] = bestID;
  if(identifier == "HR"){
   toLog[2] = Math.round(dispMins/60);
   toLog[1] = 0;
  }
  else if(identifier == "GPS"){
    toLog[2] = 0;
    toLog[1] = Math.round(dispDist/1000);
  }
}

///////////////////////////////////////
//////////////^^^^^^^^^^ find best and show in UI
///////////////////////////////////////


///////////////////////////////////////
//////////////vvvvvvvv nceno.log()
///////////////////////////////////////

function resetLog(){
  $('#redeem').show();
    makeWorkoutPage();   //might cause a bug..
  $("#logLoader").hide();
}
$('#logModal').on('hidden.bs.modal', function (e) {
  resetLog();
});


$("#redeem").click(function() {
  $("#logLoader").show();
  $("#redeem").hide();

  NcenoBrands.methods.log(
    _goalID, 
    Cookies.get('stravaID'), 
    toLog[1], 
    toLog[2], 
    toLog[0], 
    "0x22222",
    345
  )
  .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){
        
        console.log(result);
      }
      else

      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){
    console.log(receipt.status);
    if(receipt.status === true){
        correctNonce++;
        $("#logLoader").hide();
        $("#logSuccess").html("Great job! Check your points wallet in a minute.");
        //listen to see if player is a first finisher
        Nceno.events.Log({
          filter: {paramGoalID: _goalid, paramStravaID: Cookies.get('stravaID'), finisher: true },
          fromBlock: 0, toBlock: 'latest'
        }, function(error, event){ 
            //do some stuff
            //ex. usdPayout = parseInt(event.returnValues._payout);
            if(event.returnValues.finisher != false) $("#logSuccess").html("You're one of the first 3 to finish the challenge! Go see the challenge admin to claim the top prize.");
          }
        ).on('error', console.error);

      }
      else{
        $("#logLoader").hide();
        $("#redeem").hide();
        console.error("redeem error");
      } 
    }
  ).once('error', function(error){console.log(error);});
});

///////////////////////////////////////
//////////////^^^^^^^ nceno.log()
///////////////////////////////////////



$("#dispHR").html("-"); 
$("#dispMins").html("-");
$("#dispTime").html("-"); 
$("#dispSpeed").html("-");
$("#dispDist").html("-"); 
$("#dispValue").html("-");

function signOut(){
  Cookies.remove('access_token');
  Cookies.remove('stravaID');
  Cookies.remove('stravaUsername');
  Cookies.remove('userWallet');
  location.reload();
}

var lastLogTime = 0;
function makeWorkoutPage(){
  
  //$('#me').empty(); //may fix the bug
  //prepare the workouts to be filtered and logged
  makeActivities();

  setTimeout(function(){ gapAdjust(); }, 1500);


  //---get goal params

  NcenoBrands.methods.getGoalParams(_goalID)
  .call({from: Cookies.get('userWallet')},
    async function(error, resultA) {
      if (!error){
        var start = parseInt(resultA[0]);
        var dur = parseInt(resultA[1]);
        var tokenCap = parseInt(resultA[2]);
        var compcount = parseInt(resultA[3]);
        var remainingTokens = parseInt(resultA[4]);
        var bpmReward = parseInt(resultA[5]); //per 10mins
          //HRreward= parseInt(resultA[5]);
        var kmReward = parseInt(resultA[6]); //per km
          //KMreward=parseInt(resultA[6]);

        $('#me').empty();  //may fix the bug

        //---get other players
        for(var i= 0; i<compcount; i++){

          await NcenoBrands.methods.getIndexedPlayerID(_goalID, i)
          .call({from: Cookies.get('userWallet')},
            function(error, resultB) {
              if (!error){
                var playerID =  resultB[0]; 
                //fill the whitespace
                var playerName = resultB[1];
                //---call that player
                NcenoBrands.methods.getPlayer(_goalID, playerID)
                .call({from: Cookies.get('userWallet')},
                  function(error, resultC) {
                    if (!error){
                      //console.log(result);
                      
                      var theirKms = resultC[0]; 
                      var theirMins = resultC[1]; 
                      var theirReward = resultC[2];
                      var theirProgress = Math.round(100*theirReward/tokenCap);
                      var avatar = resultC[4];

                      
                      switch(avatar){
                        case "0":
                          avatar = "avatar0";
                          break;

                        case "1":
                          avatar = "avatar1";
                          break;
                          
                        case "2":
                          avatar = "avatar2";
                          break;
                          
                        case "3":
                          avatar = "avatar3";
                          break;
                        
                        case "4":
                          avatar = "avatar4";
                          break;
                        
                        case "5":
                          avatar = "avatar5";
                          break;

                        case "6":
                          avatar = "avatar6";
                          break; 

                        case "7":
                          avatar = "avatar7";
                          break;
                      }

                      if(playerID == Cookies.get('stravaID')){
                        //post to top if it's me
                          //if(! $("#me").length){
                            $("#me").prepend(
                              '<h4 class="progress-title">'  +playerName+ '<font style="color:#ccff00;"> +' +theirReward+' '+TOKENSYMBOL+ '</font> / <font style="color:#f442b3;">' +theirKms+ 'km + '+theirMins+'mins</font></h4><div class="progress-item"><div class="progress"><div class="progress-bar bg-blue" role="progressbar" style="width:' +theirProgress+ '%;" aria-valuenow="' +theirProgress+ '" aria-valuemin="0" aria-valuemax="100"><span><img height="40" width="40" src="../app/assets/images/'+avatar+'.png"> </span></div></div>'
                            );

                            lastLogTime = resultC[3]*1000;
                            /*var bla = new Date().getTime() - lastLogTime
                            console.log("last log time was: "+lastLogTime);
                            console.log("diff "+bla);
                            console.log("last log day "+ new Date(lastLogTime).getDay());
                            console.log("now: "+new Date().getDay());*/

                            if(lastLogTime!= null && new Date(lastLogTime).getDay() == new Date().getDay() && (new Date().getTime() -lastLogTime)<86400000) $("#log").hide();
                          //}
                        //}
                        //populate my quick stats .........
                        $("#progressPerc").html(theirProgress+'%');
                        $("#user").html(playerName);                
                        var days = Math.round((start+dur*86400-Date.now()/1000)/86400);
                        $("#daysLeft").html(days+" days");
                        $("#rewardSlot").html(theirReward+' '+TOKENSYMBOL);
                        $("#potRem").html(remainingTokens+' '+TOKENSYMBOL);
                        if(remainingTokens<1){
                          $("#log").hide();
                        }

                        $("#leaderboardCount").html(compcount);

                      }
                      //only after if there isn't already an element of the same name
                      else if(! $('#'+playerName.replace(/ /g,"_")).length){
                        //.after following entries

                        $('#startList').after(
                          '<div id="'+playerName.replace(/ /g,"_")+'" class="col-12 mt-2"><h4 class="progress-title">'  +playerName+ '<font style="color:#ccff00;"> +' +theirReward+' '+TOKENSYMBOL+ '</font> / <font style="color:#f442b3;">' +theirKms+ 'km + '+theirMins+'mins</font></h4><div class="progress-item"><div class="progress"><div class="progress-bar bg-blue" role="progressbar" style="width:' +theirProgress+ '%;" aria-valuenow="' +theirProgress+ '" aria-valuemin="0" aria-valuemax="100"><span><img height="40" width="40" src="../app/assets/images/'+avatar+'.png"> </span></div></div></div></div>'
                        );
                      }                      
                    }
                    else{
                      console.error(error);
                    }
                  }
                );
                //---/ call that player
              }
              else{
                console.error(error);
              }
            }
          );
        }//end for
        //---/ get other players
      }
      else{
        console.error(error);
      }
    }
  );
  //---/ get goal params
}


async function loadCodes(num){
  var dict=new Array();

  //make the list
  for(let k=0; k<num; k++){
    dict.push(TOKENSYMBOL+"-"+web3.utils.padRight(web3.utils.randomHex(3),6)+"-"+k); //ex. SUN-0xcfd1a4-209
  }
  console.log("your invite codes are:");
  console.table(dict);

  //start loading them
  for(let i=0; i<(num/10); i++){
    await NcenoBrands.methods.addInviteCodes(
      _goalID,
      dict.slice(i*10,(i+1)*10)
      
    ).send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
      async function(error, result) {
        if (!error){
          await console.log(result);
        }
        else
        console.error(error);
      }
      ).once('confirmation', async function(confNumber, receipt){
        
        if(receipt.status == true){
          correctNonce++;
          await console.log(receipt.status);
        }
        else{
          console.log('error loading codes.');
        }
    });
  }
}

NcenoBrands.events.MakeOrder({
    //filter: {paramGoalID: _goalID},
    fromBlock: 6016216, toBlock: 'latest' //6016216
}, function(error, event){ console.log(event); })
.on('data', function(event){
    console.log("New order was placed!");
    //console.log(event); // same results as the optional callback above
    makeOrdersPage();
})
.on('error', console.error);

NcenoBrands.events.UpdateOrder({
    //filter: {paramGoalID: _goalID},
    fromBlock: 6016216, toBlock: 'latest' //6016216
}, function(error, event){ console.log(event); })
.on('data', function(event){
    console.log("Order status was changed!");
    //console.log(event); // same results as the optional callback above
    makeOrdersPage();
})
.on('error', console.error);

var avgPurchase;
///////----rangeslider stuff
$(function() {

  var $document = $(document);
  var selector = '[data-rangeslider]';
  var $element = $(selector);

  // For ie8 support
  var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

  // Example functionality to demonstrate a value feedback
  function valueOutput(element) {
      var value = element.value;
      var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
      output[textContent] = value;
  }

  $document.on('input', 'input[type="range"], ' + selector, function(e) {
      valueOutput(e.target);
  });

  // Basic rangeslider initialization
  $element.rangeslider({

      // Deactivate the feature detection
      polyfill: false,

      // Callback function
      onInit: function() {
          valueOutput(this.$element[0]);
      },

      // Callback function
      onSlide: function(position, value) {
          //console.log('onSlide');
          //console.log('position: ' + position, 'value: ' + value);
          avgPurchase = value;
      },

      // Callback function
      onSlideEnd: function(position, value) {
          //console.log('onSlideEnd');
          //console.log('position: ' + position, 'value: ' + value);
          avgPurchase = value;
      }
  });
});
//////---- end range slider stuff

$('#price1').html(item1.price +" "+TOKENSYMBOL);
$('#title1').html(item1.descr);

$('#price2').html(item2.price +" "+TOKENSYMBOL);
$('#title2').html(item2.descr);

$('#price3').html(item3.price +" "+TOKENSYMBOL);
$('#title3').html(item3.descr);

$('#price4').html(item4.price +" "+TOKENSYMBOL);
$('#title4').html(item4.descr);

$('#price5').html(item5.price +" "+TOKENSYMBOL);
$('#title5').html(item5.descr);


function joinModalLoad(){
  NcenoBrands.methods.getGoalParams(_goalID)
    .call({from: Cookies.get('userWallet')},
      async function(error, result) {
        if (!error){
          $("#startTime").html(new Date(result[0]*1000).toDateString());
          $("#endTime").html(new Date((result[0]*1+86400*result[1])*1000).toDateString());
          $("#capEcho").html(result[2]+" "+TOKENSYMBOL);
          $("#bpmRate").html(result[5]+" "+TOKENSYMBOL);
          $("#kmRate").html(result[6]+" "+TOKENSYMBOL);
          $("#companyTitle").html(companyName);
        }
      else{
        console.error(error);
      }
    }
  );
}

//hide tabs from non-admins
if(Cookies.get('userWallet') != "0x0B51bdE2EE3Ca800E9F368f2b3807a0D212B711a" && Cookies.get('stravaID')!="42846718") {
  $("#adminOrders").hide();
  $("#adminAdmin").hide();
}

if(Cookies.get('userWallet') == undefined || Cookies.get('access_token')== undefined) {
  $("#adminOrders").hide();
  $("#adminAdmin").hide();
  for(let i=1; i< inventory; i++){
    $('#buyModalbtn'+i).hide();
  }
  $("#myTokens").hide();
  $("#purchaseHistory").hide();
  $("#myQuickStats").hide();
}

$("#joinUsername").html(Cookies.get('stravaUsername'));
$("#joinLoader").hide();

function orderSearch(){

  NcenoBrands.methods.searchOrders(
      $("#searchField").val()
    )
  //item0, buyerName1, price2, date3, status4
    .call({from: Cookies.get('userWallet'), nonce: correctNonce},
      function(error, result) {
        if (!error){

          $("#theOrder").show();
          var statusCode;
          switch(result[4]) {
            case "0":
              statusCode = "new";
              break;
            case "1":
              statusCode = "complete";                    
              break;
            case "2":
              statusCode = "refunded";
              break;
          }
          $("#searchedOrder").html('<tr><td data-toggle="modal" data-target="#refundModal" onclick="setRefTarget('+"'"+$("#searchField").val()+"'"+');" data-whatever="@mdo" >'+statusCode+'</td><td style="color:#ccff00;">'+$("#searchField").val()+'</td><td >'+result[1]+'</td><td>'+result[0]+'</td><td  >'+result[2]+'</td><td >'+new Date(result[3]*1000).toDateString()+'</td></tr>');
        }
        
        else
        console.error(error);
      }
    );
}

var refTarget;
function setRefTarget(_orderNo){
  refTarget = _orderNo;
}

$("#statusLoader").hide();
function resetUpdateOrder(){
  $("#settleBtn").show();
  $("#issueRefund").show();
  $("#statusLoader").hide();
  $("#statusEcho").html('');
  makeOrdersPage();
}
$('#refundModal').on('hidden.bs.modal', function (e) {
  resetUpdateOrder();
});

function setOrderStatus(_orderNo, _action){
  $("#settleBtn").hide();
  $("#issueRefund").hide();
  $("#statusLoader").show();

  if(_action == "refunded"){
    //nceno refund
    NcenoBrands.methods.setOrderStatus(
      _goalid,
      _orderNo,
      2
    ).send({from: Cookies.get('userWallet'), gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
      function(error, result) {
        if (!error){
          
          console.log(result);
        }
        else
        console.error(error);
      }
    ).once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        correctNonce++;

        TheToken.methods.transfer(
          adminWallet,
          $('#cost'+refTarget).val()
        )
        .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
          function(error, result) {
            if (!error){
              //loader
            }
            else
            console.error(error);
          }
        ).once('confirmation', function(confNumber, receipt){
          console.log(receipt.status);
          if(receipt.status == true){
            correctNonce++;
            $("#statusLoader").hide();
            $("#statusEcho").html("order status has been updated.");

            console.log("issuing a refund!");
            $('#status'+_orderNo).css({color: "#333"});
            $('#status'+_orderNo).html("refunded");
            $('#order'+_orderNo).css({color: "#333"});
            $('#name'+_orderNo).css({color: "#333"});
            $('#item'+_orderNo).css({color: "#333"});
            $('#cost'+_orderNo).css({color: "#333"});
            $('#date'+_orderNo).css({color: "#333"});
            $('#status'+_orderNo).css({color: "#333"});      
          }
          else{
            console.log('error. status could not be updated');
          }
        });
        
      }
      else{
        
        console.log("error.");
      } 
    }).once('error', function(error){console.log(error);});

  }
  else if(_action == "settled"){
    //nceno settle
    NcenoBrands.methods.setOrderStatus(
      _goalID,
      _orderNo,
      1
    ).send({from: Cookies.get('userWallet'), gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
      function(error, result) {
        if (!error){
          /*$("#settleBtn").hide();
          $("#issueRefund").hide();
          $("#statusLoader").show();*/
          
          console.log(result);
        }
        else
        console.error(error);
      }
    ).once('confirmation', function(confNumber, receipt){ 
      console.log(receipt.status);
      if(receipt.status == true){
        correctNonce++;
        $("#statusLoader").hide();
        $("#statusEcho").html("order status has been updated.");

        console.log("settling the sale!");
        $('#status'+_orderNo).css({color: "#333"});
        $('#status'+_orderNo).html("complete");

          $('#order'+_orderNo).css({color: "#333"});
          $('#name'+_orderNo).css({color: "#333"});
          $('#item'+_orderNo).css({color: "#333"});
          $('#cost'+_orderNo).css({color: "#333"});
          $('#date'+_orderNo).css({color: "#333"});
          $('#status'+_orderNo).css({color: "#333"});
      }
      else{
        
        console.log("error.");
      } 
    }).once('error', function(error){console.log(error);});
  } 
}

async function makeOrdersPage(){
  $("#theOrder").hide();
  //get the order count
  await NcenoBrands.methods.getCompanyOrderCt(
    companyID
  )
  .call({from: Cookies.get('userWallet'), nonce: correctNonce},
    async function(error, result) {
      if (!error){
        var playerOrderCt = await result;
        correctNonce++;
        //empty the list and then start making the it
        $("#orderList").empty();
        for(let i = 0; i<playerOrderCt; i++){
          await NcenoBrands.methods.getIndexedOrder(
            companyID,
            i
          )
          .call({from: Cookies.get('userWallet'), nonce: correctNonce},
            async function(error, result2) {
              if (!error){
                var that = await result;
                console.log(result2[5]+" status is "+result2[4]);

                //var statusCode;
                switch(result2[4]) {
                  case '0':
                    //var statusCode = "new";
                    if(! $('#co'+result2[5]).length) $("#orderList").append('<tr id="co'+result2[5]+'"><td id = "status'+result2[5]+'" data-toggle="modal" data-target="#refundModal" onclick="setRefTarget('+"'"+result2[5]+"'"+');" data-whatever="@mdo" >new</td><td style="color:#ccff00;" id = "order'+result2[5]+'">'+result2[5]+'</td><td id = "name'+result2[5]+'">'+result2[1]+'</td><td id = "item'+result2[5]+'">'+result2[0]+'</td><td id = "cost'+result2[5]+'" >'+result2[2]+'</td><td id = "date'+result2[5]+'">'+new Date(result2[3]*1000).toDateString().slice(0, -4)+'</td></tr>');
                    console.log("new order");
                    break;

                  case '1':
                    //var statusCode = "complete";
                    if(! $('#co'+result2[5]).length) $("#orderList").append('<tr id="co'+result2[5]+'"><td id = "status'+result2[5]+'" data-toggle="modal" data-target="#refundModal" onclick="setRefTarget('+"'"+result2[5]+"'"+');" data-whatever="@mdo" >complete</td><td style="color:#333;" id = "order'+result2[5]+'">'+result2[5]+'</td><td id = "name'+result2[5]+'">'+result2[1]+'</td><td id = "item'+result2[5]+'">'+result2[0]+'</td><td id = "cost'+result2[5]+'" >'+result2[2]+'</td><td id = "date'+result2[5]+'">'+new Date(result2[3]*1000).toDateString().slice(0, -4)+'</td></tr>');
                    $('#order'+result2[5]).css({color: "#333"});
                    $('#name'+result2[5]).css({color: "#333"});
                    $('#item'+result2[5]).css({color: "#333"});
                    $('#cost'+result2[5]).css({color: "#333"});
                    $('#date'+result2[5]).css({color: "#333"});
                    $('#status'+result2[5]).css({color: "#333"});
                    console.log("complete order");
                    break;

                  case '2':
                    //var statusCode = "refunded";
                    if(! $('#co'+result2[5]).length) $("#orderList").append('<tr id="co'+result2[5]+'"><td id = "status'+result2[5]+'" data-toggle="modal" data-target="#refundModal" onclick="setRefTarget('+"'"+result2[5]+"'"+');" data-whatever="@mdo" >refunded</td><td style="color:#333;" id = "order'+result2[5]+'">'+result2[5]+'</td><td id = "name'+result2[5]+'">'+result2[1]+'</td><td id = "item'+result2[5]+'">'+result2[0]+'</td><td id = "cost'+result2[5]+'" >'+result2[2]+'</td><td id = "date'+result2[5]+'">'+new Date(result2[3]*1000).toDateString().slice(0, -4)+'</td></tr>');
                    $('#order'+result2[5]).css({color: "#333"});
                    $('#name'+result2[5]).css({color: "#333"});
                    $('#item'+result2[5]).css({color: "#333"});
                    $('#cost'+result2[5]).css({color: "#333"});
                    $('#date'+result2[5]).css({color: "#333"});
                    $('#status'+result2[5]).css({color: "#333"});
                    console.log("refunded order");
                    break;
                }
                //item0, buyerName1, price2, date3, status4, orderNo5
                //if(! $('#co'+result2[5]).length) $("#orderList").append('<tr id="co'+result2[5]+'"><td id = "status'+result2[5]+'" data-toggle="modal" data-target="#refundModal" onclick="setRefTarget('+"'"+result2[5]+"'"+');" data-whatever="@mdo" >'+statusCode+'</td><td style="color:#ccff00;" id = "order'+result2[5]+'">'+result2[5]+'</td><td id = "name'+result2[5]+'">'+result2[1]+'</td><td id = "item'+result2[5]+'">'+result2[0]+'</td><td id = "cost'+result2[5]+'" >'+result2[2]+'</td><td id = "date'+result2[5]+'">'+new Date(result2[3]*1000).toDateString()+'</td></tr>');
              
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

async function makeSpendPage(){
  var myBalance
  if(Cookies.get('userWallet') != undefined && Cookies.get('access_token')!= undefined){
    //show token balance
   await TheToken.methods.balanceOf(
      Cookies.get('userWallet')
    )
    .call({from: Cookies.get('userWallet'), nonce: correctNonce},
      async function(error, result) {
        if (!error){
          $("#tokenBalance").html(result+" "+TOKENSYMBOL);
          myBalance =  result;
        }
        else
        console.error(error);
      }
    );

    //get the order count
    await NcenoBrands.methods.getPlayerOrderCt(
      Cookies.get('stravaID')
    )
    .call({from: Cookies.get('userWallet'), nonce: correctNonce},
      async function(error, result) {
        if (!error){
          var playerOrderCt =  result;
          correctNonce++;
          //start making the list
          for(let i = 0; i<playerOrderCt; i++){
            await NcenoBrands.methods.getIndexedPlayerOrder(
              Cookies.get('stravaID'),
              i
            )
            .call({from: Cookies.get('userWallet'), nonce: correctNonce},
              async function(error, result) {
                if (!error){
                  var theOrder = await result[0];
                  if(! $('#order'+result[0]).length) $("#orderHistory").append('<tr id="order'+result[0]+'"><td>'+result[0]+'</td><td>'+result[1]+'</td><td>'+result[2]+'</td><td>'+new Date(result[3]*1000).toDateString()+'</td></tr>');
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

  if(myBalance<item1.price){
    $("#action1").html('<font style="color:#f442b3;">Not enough '+TOKENSYMBOL+'</font>');
  }
  else if(Cookies.get('access_token')== undefined){
    $("#action1").html('');
  }
  else{
    $("#action1").html('<a id="buyModalbtn1" onclick="setTarget(item1);" data-toggle="modal" data-target="#popupBuy" class="btn btn-sm btn-outline-white">Buy now</a>');
  }
  ////////
  if(myBalance<item2.price){
    $("#action2").html('<font style="color:#f442b3;">Not enough '+TOKENSYMBOL+'</font>');
  }
  else if(Cookies.get('access_token')== undefined){
    $("#action2").html('');
  }
  else{
    $("#action2").html('<a id="buyModalbtn2" onclick="setTarget(item2);" data-toggle="modal" data-target="#popupBuy" class="btn btn-sm btn-outline-white">Buy now</a>');
  }
  /////////
  if(myBalance<item3.price){
    $("#action3").html('<font style="color:#f442b3;">Not enough '+TOKENSYMBOL+'</font>');
  }
  else if(Cookies.get('access_token')== undefined){
    $("#action3").html('');
  }
  else{
    $("#action3").html('<a id="buyModalbtn3" onclick="setTarget(item3);" data-toggle="modal" data-target="#popupBuy" class="btn btn-sm btn-outline-white">Buy now</a>');
  }
  /////////
  if(myBalance<item4.price){
    $("#action4").html('<font style="color:#f442b3;">Not enough '+TOKENSYMBOL+'</font>');
  }
  else if(Cookies.get('access_token')== undefined){
    $("#action4").html('');
  }
  else{
    $("#action4").html('<a id="buyModalbtn4" onclick="setTarget(item4);" data-toggle="modal" data-target="#popupBuy" class="btn btn-sm btn-outline-white">Buy now</a>');
  }
  /////////
  if(myBalance<item5.price){
    $("#action5").html('<font style="color:#f442b3;">Not enough '+TOKENSYMBOL+'</font>');
  }
  else if(Cookies.get('access_token')== undefined){
    $("#action5").html('');
  }
  else{
    $("#action5").html('<a id="buyModalbtn5" onclick="setTarget(item5);" data-toggle="modal" data-target="#popupBuy" class="btn btn-sm btn-outline-white">Buy now</a>');
  }
}//end makeSpendPage

var targetName;
var targetPrice;
var orderNo;
function setTarget(item){
  targetName = item.name;
  targetPrice = item.price;
  console.log("item is: "+targetName+" for "+targetPrice+ " tokens");
  $("#buyEcho").html('<h5><font style="color:#ccff00;">'+Cookies.get('stravaUsername')+'</font>, you are about to get <font style="color:#ccff00;">"'+targetName+'"</font> <br>for <font style="color:#ccff00;">'+targetPrice+'</font> '+TOKENSYMBOL+' points.</h5>');

}

function resetSpend(){
  $("#buyQs").show();

  $("#cancelBuy").show();
  $("#buyLoader").hide();
  $("#getYouPaid").html("Remember those workouts? They're about to pay off!");
  $('input[name="q3Radio"]').prop('checked', false);
  $('input[name="q4Radio"]').prop('checked', false);
  makeSpendPage();
}
$('#popupBuy').on('hidden.bs.modal', function (e) {
  resetSpend();
});


$("#buyLoader").hide();
//only let the user buy after they answer the questions.
$("#confirmBuy").hide();
$("#radio10").on('click', function(){
  if($('input[name="q3Radio"]').is(':checked') && $('input[name="q4Radio"]').is(':checked')) {
    $("#confirmBuy").show(); 
  } 
  else {
    $("#confirmBuy").hide(); 
  }
});

$("#radio11").on('click', function(){
  if($('input[name="q3Radio"]').is(':checked') && $('input[name="q4Radio"]').is(':checked')) {
    $("#confirmBuy").show(); 
  } 
  else {
    $("#confirmBuy").hide(); 
  }
});

$("#radio12").on('click', function(){
  if($('input[name="q3Radio"]').is(':checked') && $('input[name="q4Radio"]').is(':checked')) {
    $("#confirmBuy").show(); 
  } 
  else {
    $("#confirmBuy").hide(); 
  }
});

$("#radio13").on('click', function(){
  if($('input[name="q3Radio"]').is(':checked') && $('input[name="q4Radio"]').is(':checked')) {
    $("#confirmBuy").show(); 
  } 
  else {
    $("#confirmBuy").hide(); 
  }
});



function buy(){
  $("#confirmBuy").hide();
  $("#cancelBuy").hide();
  $("#buyLoader").show();
  $("#buyQs").hide();


  //deposit tokens here...
  TheToken.methods.transfer(
    adminWallet,
    targetPrice
  )
  .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){
        
        orderNo = web3.utils.padRight(web3.utils.randomHex(3),6);
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){
    console.log(receipt.status);
    if(receipt.status == true){
      correctNonce++;
      //---begin make order
        NcenoBrands.methods.makeOrder(
          _goalID, 
          companyID, 
          orderNo,
          Cookies.get('stravaID'), 
          targetName, 
          targetPrice,
          $('input[name="q3Radio"]:checked').val(),
          $('input[name="q4Radio"]:checked').val()
        ).send({from: Cookies.get('userWallet'), gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
          function(error, result) {
            if (!error){

              
              console.log(result);
            }
            else
            console.error(error);
          }
        ).once('confirmation', function(confNumber, receipt){ 
          console.log(receipt.status);
          if(receipt.status == true){
            updateNonce();
            $("#getYouPaid").html("Your receipt");
            $("#buyLoader").hide();
            $("#buyEcho").html('<h5><font style="color:#ccff00;">'+Cookies.get('stravaUsername')+'</font>, you just bought <font style="color:#ccff00;">"'+targetName+'"</font> <br>for <font style="color:#ccff00;">'+targetPrice+'</font> '+TOKENSYMBOL+' points.</h5><br>  <font style="color:#fff;">Show this code to the <font style="color:#ccff00;">'+companyName+'</font> admin <br>to receive your purchase.</font> <h1><b style="color:#ccff00;" >'+orderNo+'</b></h1>');
            
          }
          else{
            $("#getYouPaid").html("Error completing purchase...");
            console.log("buy error.");
          } 
        }).once('error', function(error){
          $("#getYouPaid").html("Error completing purchase...");
          console.log(error);
        });
      //---end makeorder
    }
    else{
      $("#getYouPaid").html("Error completing purchase...");
      console.log('error. not enough funds?');
    }
  });
}







function makeAdminPage(){

}


//datepicker initializer
var first = new Date();
first.setDate(first.getDate() + 1);
//$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$('[data-toggle="datepicker"]').datepicker({'autoHide': true, 'startDate': first});
$("#time").click(function(){
  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  console.log(time);
})

function showCookies(){
  console.log("access_token: "+Cookies.get('access_token'));
  console.log("stravaID: "+Cookies.get('stravaID'));
  console.log("stravaUsername: "+Cookies.get('stravaUsername'));
  console.log("userWallet: "+Cookies.get('userWallet'));
}

var correctNonce = 0;
function updateNonce(){
  web3.eth.getTransactionCount(Cookies.get('userWallet')).then(nonce => {
    correctNonce = nonce;
  });
  console.log("nonce is: "+correctNonce);
}

//transaction is mined successfully --> correctNonce++;

//sanity check for debugging
//console.log(NcenoBrands);

//hides all the loaders
$("#createBtn").hide();
$("#acctLoader").hide();
$("#acctSuccess").hide();
$("#createLoader").hide();
$("#createSuccess").hide();
//$("#dashboard").hide();
$("#logLoader").hide();
$("#logSuccess").hide();
$("#claimLoader").hide();
$("stravaSuccess").hide();
$("stravaOk").hide();
$("portisSuccess").hide();
$("#request").hide();
$("#joinChallengeLoader").hide();
//$("#joinSuccess").hide();
$("#joinSoonLoader").hide();
//$("#joinSoonSuccess").hide();
$("#makeAcctBtn").hide();
$("#openWallet").hide();
$("#portisLoader").hide();

$("#joinSearch").hide();
$('#joinSoonModalBtn').hide();
$("#claimBtn").show();



//timestamps are in this format: yyyymmddT160000Z
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
function reminder(_target, _stake, _minutes, _frequency, _duration, _goalid, _start){
  //need to convert these times

  var s = new Date(_start*1000).toISOString();
  //.000, -, :
  var start = s.replace(/:/g, "").replace(/-/g, "").replace(".000", "");
  var e = new Date(1000*(_start+_duration*604800)).toISOString();
  var end = e.replace(/:/g, "").replace(/-/g, "").replace(".000", "");
  $('#'+_target).html('<a style="color:#ccff00;" target= "_blank" href ="https://www.google.com/calendar/r/eventedit?text=My%20Nceno%20goal&location=www.NcenoBrands.app/app.html&details=You%20committed%20$' + _stake + '%20to%20working%20out%20for%20' + _minutes + 'min,%20'+ _frequency+ 'x%20per%20week,%20for%20'+ _duration + '%20weeks.%20The%20challenge%20ID%20is%20'+_goalid+'.&dates='+start+'/'+end+'">Add to Google Calendar</a>');
}

//shares the challenge to strava automatically
function stravaShare(_start, _minutes, _stake, _frequency, _weeks, _goalid){
  var challengeStart = new Date(_start*1000).toDateString();
  var startDateLocal = new Date().toISOString(); //need to convert from UTC to local timezone.... will not affect the challenge.

  var nameString = '$'+_stake+'... Anyone wanna join me?';
  var descriptionString = 'I’m hosting a challenge worth $'+_stake+ ' to workout for '+_minutes+'mins, '+_frequency+'x per week, for '+_weeks+' weeks. If you wanna join me, go to www.NcenoBrands.app/app and search for challenge ID "'+_goalid.slice(0, 8)+'". It starts on '+ challengeStart+'.';

  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function(){
    if (this.readyState === 4) {
        console.log(this.responseText);
        var data = JSON.parse(xhr.responseText);
        console.log("shared to strava.");
    }
  });
  xhr.open("POST", 'https://www.strava.com/api/v3/activities?name='+nameString+'&type=Workout&start_date_local='+startDateLocal+'&elapsed_time='+_minutes*60+'&description='+descriptionString);
  xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
  xhr.send(stuff);
}

//show create button only if user agrees to terms

$("#joinModBtn").hide();
$("#joinChecker").on('click', function(){
  if($("#joinChecker").is(':checked') && $('input[name="q1Radio"]').is(':checked') && $("#avgSpend").val() != 0) {
    $("#joinModBtn").show(); 
  } 
  else {
    $("#joinModBtn").hide(); 
  }
});

$("#radio8").on('click', function(){
  if($("#joinChecker").is(':checked') && $('input[name="q1Radio"]').is(':checked') && $("#avgSpend").val() != 0) {
    $("#joinModBtn").show(); 
  } 
  else {
    $("#joinModBtn").hide(); 
  }
});

$("#radio9").on('click', function(){
  if($("#joinChecker").is(':checked') && $('input[name="q1Radio"]').is(':checked') && $("#avgSpend").val() != 0) {
    $("#joinModBtn").show(); 
  } 
  else {
    $("#joinModBtn").hide(); 
  }
});



//brands join
$("#joinModBtn").click(function() {
  $("#joinLoader").show();
  $("#avatarChoices").hide();
  $("#joinModBtn").hide();
  $("#codeField").hide();
  $("#nameField").hide();
  $("#soonJoinTitle").hide();

  NcenoBrands.methods.join(
    _goalID, 
    Cookies.get('stravaID'), 
    $("#nameField").val(),
    $('input[name="avatarRadio"]:checked').val(), 
    $("#codeField").val(),
    $('input[name="q1Radio"]:checked').val(),
    $('#avgSpend').val()
    )
  .send({from: Cookies.get('userWallet'), gas: 1000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){

        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){ 
    console.log(receipt.status);
    if(receipt.status === true){
      updateNonce();
      $("#joinLoader").hide();
      $("#joinPrompt").html('You'+"'"+'re in. Good luck, '+$("#nameField").val()+'!');
      //$("joinChallenge").hide();
    }
    else{
      $("#joinLoader").show();
      $("#avatarChoices").hide();
      $("#joinModBtn").hide();
      $("#codeField").hide();
      $("#nameField").hide();
      $("#soonJoinTitle").hide();
      $('#joinPrompt').html('<p>Sorry, invite code invalid or challenge is inactive.</p>');
      console.log("join error.");
    } 
  }).once('error', function(error){console.log(error);});
});



//randomizes the goalID
/*function randGoalID(){
  goalID = web3.utils.padRight(web3.utils.randomHex(3),6);
}*/

//creating a goal from the slider values and live ethereum price
//var goalID = web3.utils.padRight(web3.utils.randomHex(3),6);
/*$("#hostBtn").click(function() {

  var KmReward = $("#sliderReward").roundSlider('getValue',1).toString();
  var BpmReward = $("#sliderReward").roundSlider('getValue',2)-$("#sliderReward").roundSlider('getValue',1).toString();
  var target = $("#sliderTarget").roundSlider("getValue");
  var kmTarget = Math.round(target/($("#sliderReward").roundSlider('getValue',1)*(1+0.1*$("#sliderReward").roundSlider('getValue',2))));
  var minsTarget = 10*kmTarget;
  var start = new Date($("#dateChoice").datepicker('getDate')).getTime() / 1000;
  var daysDur = $("#sliderDays").roundSlider("getValue").toString();
  var pot = $("#sliderPot").roundSlider("getValue").toString();

  NcenoBrands.methods.host(
    goalID,
    start,  
    daysDur,
    kmTarget.toString(), 
    minsTarget.toString(),  
    pot, 
    KmReward, 
    BpmReward, 
    tokenAddress
  )
  .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
    function(error, result) {
      if (!error){
        $("#hostBtn").hide();
        $("#cancelBtn").hide();
        $("#createLoader").show();
        console.log(result);
      }
      else
      console.error(error);
    }
  ).once('confirmation', function(confNumber, receipt){
    console.log(receipt.status);
    if(receipt.status === true){
      correctNonce++;
      //deposit tokens here...
      TheToken.methods.transfer(
        contractAddress,
        pot
      )
      .send({from: Cookies.get('userWallet'), nonce: correctNonce, gas: 3000000, gasPrice: Math.ceil(gasPriceChoice)*1000000000},
        function(error, result) {
          if (!error){
            $("#createLoader").show();
            console.log(result);
          }
          else
          console.error(error);
        }
      ).once('confirmation', function(confNumber, receipt){
        console.log(receipt.status);
        if(receipt.status === true){
          correctNonce++;
          $("#createLoader").hide();
          $("#createSuccess").show();
          $("#hostBtn").hide();
        }
      })      
    }
    else{
      $("#createLoader").hide();
      $("#hostBtn").hide();
      $('#createFail').html('<p>Transaction failed. User account does not exist, or else message value is less than intended stake.</p>');
      console.log("User does not exist, or else message value is less than intended stake.");
    }
    }
    )
    .once('error', function(error){console.log(error);});;
});

//function that displays in a modal, a summary of the goal you are setting.
function echoGoal(){

  var time = new Date($("#dateChoice").val()).getTime() / 1000;
  //echo modal
  $("#host").tab('show');
  $('#popupCreate').modal('show');

  $("#goalEcho").html(
    "You're offering a maximum of " + $("#sliderPot").roundSlider("getValue") + " tokens to your employees to work out for " + 
    $("#sliderDays").roundSlider("getValue")+  " days, at a reward rate of "+$("#sliderReward").roundSlider('getValue',1)+" tokens/km with no heart rate data, and "+
    $("#sliderReward").roundSlider('getValue',2)+" tokens/10min for exercises with heart rate, starting automatically from "+ $("#dateChoice").datepicker('getDate', true) +"."
  );
  console.log($("#sliderReward").roundSlider('getValue',1));
}*/

function resetJoin(){
  $("#avatarChoices").show();
  $("#soonJoinTitle").show();
  $("#nameField").show();
  $("#codeField").show();
  //$("#joinModBtn").show();
  $("#joinPrompt").html('');
  $('#joinLoader').hide();
  $('input[name="q1Radio"]').prop('checked', false);
}
$('#popupSoonJoin').on('hidden.bs.modal', function (e) {
  resetJoin();
})




//helper function that populates the manage page with all the goodies. needs work.
function makePage(){
  makeList();
  selectedChallenge();
  updateNonce();
  //quickStats();
  getToken();
}

var goalid;


var browsedGoal;


//chart tool tips
function tooltipVal1(args) {
    return args.value + " token cap";
}
function tooltipVal2(args) {
    return args.value + " token pot";
}
function tooltipVal3(args) {
    return args.value + " days";
}


var safeLow;
var standard;
var fast;
var fastest;
var gasPriceChoice
function updateGasPrice(){
  $.getJSON("https://www.etherchain.org/api/gasPriceOracle", function(data) {
    safeLow = data.safeLow;
    standard = data.standard;
    fast = data.fast;
    fastest = data.fastest;
    //default to fast gas  
    gasPriceChoice = parseInt(fastest)+1.0; 
    console.log(safeLow+" < "+standard+" < gas < "+fast+" < "+fastest);
    console.log("gasPrice set at: "+gasPriceChoice);

  });
}



///////////////////////////////
//-----begin log-in logic
///////////////////////////////

$("#loaderGlobal").hide();
$("#openWalletGlobal2").hide();
//initialize portis
//const portis = new Portis('67f0b194-14fb-4210-8535-d629eeb666b6', 'rinkeby', { gasRelay: true, scope: ['email'] });
//const web3 = new Web3(portis.provider);



//set auth creds if they exist
var access_token;
if(Cookies.get('access_token') != undefined){
  access_token = Cookies.get('access_token');
} 

var stravaID; 
if(Cookies.get('stravaID') != undefined){
  stravaID = Cookies.get('stravaID');
}
var stravaUsername; 
if(Cookies.get('stravaUsername') != undefined){
  stravaUsername = Cookies.get('stravaUsername');
}
var userWallet;
if(Cookies.get('userWallet') != undefined){
  userWallet = Cookies.get('userWallet');
}

var code;
window.onload = function(){
  $("#joinBtn").hide();

  if(Cookies.get('access_token') != undefined && Cookies.get('stravaID') != undefined && Cookies.get('userWallet') != undefined){
    var playerOrderCt
    NcenoBrands.methods.getPlayerOrderCt(
      Cookies.get('stravaID')
    )
    .call({from: Cookies.get('userWallet'), nonce: correctNonce},
      function(error, result) {
        if (!error){
          playerOrderCt = result;

          //get the goal params
          NcenoBrands.methods.getGoalParams(_goalID)
          .call({from: Cookies.get('userWallet')},
            async function(error, resultA) {
              if (!error){
                HRreward= parseInt(resultA[5]);
                console.log("HRreward="+resultA[5]);
                KMreward= parseInt(resultA[6]);
                console.log("KmReward="+resultA[6]);
              }
              else
              console.error(error);
            }
          );//---end get goal params


        }
        else
        console.error(error);
      }
    );
  }


  //$("#brandsPrompt").html('<p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
  //case 1- if you're missing everything,
  if(Cookies.get('access_token') == undefined || Cookies.get('stravaID') == undefined || Cookies.get('userWallet') == null || Cookies.get('stravaUsername') == undefined){ 
    console.log("doing case 1: missing everything...");
    //$("#debug").html('<p>doing case 1: missing everything...</p><br><p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
    $("#stravaBtnGlobal").show();
    $("#userPrompt").html('');
    $("#signOut").hide();
    $("#brandsPrompt").html('<p style="color:white;">You need to log in! <a style="color:#ccff00;" href="https://www.nceno.app/workplace.html">click here</a></p>');
  }

    //and you've been redirected from strava auth page,
      //@config  the path (and file name) will change if this is a corp well challenge
    /*if (
         window.location.href != 'https://www.nceno.app/corps/cw_demo.html#' 
      && window.location.href != 'https://www.nceno.app/corps/cw_demo#'
      && window.location.href != 'https://nceno.app/corps/cw_demo#'
      && window.location.href != 'https://nceno.app/corps/cw_demo.html#'

      && window.location.href != 'https://www.nceno.app/corps/cw_demo.html' 
      && window.location.href != 'https://www.nceno.app/corps/cw_demo'
      && window.location.href != 'https://nceno.app/corps/cw_demo'
      && window.location.href != 'https://nceno.app/corps/cw_demo.html'){
      //capture the code,
      code = window.location.href.split('=')[2].split('&')[0];
      console.log(code);
      //redeem it for the token,
      getTokenGlobal();
      //then log into portis. (included in gettoken)
    }
  }*/
  
/*  //case 2- missing portis only
  else if( Cookies.get('stravaUsername') == undefined || Cookies.get('userWallet') == undefined){
    console.log("doing case 2: missing portis only...");
    //$("#debug").html('<p>doing case 2: missing portis...</p><br><p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
    $("#stravaBtnGlobal").hide();
    $("#signOut").hide();
    $("#brandsPrompt").html('<p style="color:white;">You need to log in! <a style="color:#ccff00;" href="https://www.nceno.app/workplace.html">click here</a></p>');
    showPortisGlobal();
  }*/
  //case 3- nothing missing
    //-----disable this block when testing.------
  else if(Cookies.get('access_token') != undefined && Cookies.get('stravaID') != undefined && Cookies.get('stravaUsername') != undefined){
    console.log("doing case 3: missing nothing...");
    //$("#debug").html('<p>doing case 3: missing nothing...</p><br><p>'+Cookies.get('access_token')+'</p><br><p>'+Cookies.get('stravaID')+'</p><br><p>'+Cookies.get('stravaUsername')+'</p><br><p>'+Cookies.get('userWallet')+'</p>');
    
    $("#stravaBtnGlobal").hide();
    $("#openWalletGlobal2").show();
    $("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</h5>');
    $("#brandsPrompt").html('<p><font style="color:white;">Connection successful. <br>Welcome, </font>'+Cookies.get('stravaUsername')+'</p>');
    
    updateNonce();
    //makeWorkoutPage();
    $("#joinBtn").hide();
      //----this hides the join button if you're a player.
      NcenoBrands.methods.playerStatus(_goalID, Cookies.get('stravaID'))
      .call({from: Cookies.get('userWallet')},
        function(error, result) {
          if (!error){
            console.log("player joined already: "+result);
            if(!result){
              $("#joinBtn").show();
            }
          }
        }
      );
      //---/ hide join button
  }

  //we can only use window.onload once... so move the slider initialization here
  //sliders
  $("#sliderTarget").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 10,
    max: 100,
    step: 5,
    value: 30,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal1",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderPot").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 100,
    max: 2000,
    step: 10,
    value: 700,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal2",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderDays").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 7,
    max: 60,
    step: 1,
    value: 30,
    sliderType: "min-range",
    tooltipFormat: "tooltipVal3",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
  $("#sliderReward").roundSlider({
    editableTooltip: false,
    radius: 75,
    width: 14,
    handleSize: "30,15",
    handleShape: "circle",
    min: 1,
    max: 10,
    step: 1,
    value: "2,4",
    sliderType: "range",
    //tooltipFormat: "tooltipVal4",
    circleShape: "pie",
    startAngle: 315,
    handleSize: "+20",
    lineCap: "round"
  });
}

//var inSixHours = 0.24;
function getTokenGlobal(){
  console.log("code is: "+code);
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);

      //set the token in cookies
      access_token = data.access_token;
      Cookies.set('access_token', access_token
        //,{expires: inSixHours}
      );

      //set the stravaID in cookies
      stravaID = data.athlete.id;
      Cookies.set('stravaID', stravaID);

      $("#stravaBtnGlobal").hide();
      if(Cookies.get('stravaUsername') == undefined){
        showPortisGlobal();
      }else{
        $("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</h5>');
        $("#brandsPrompt").html('<p><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</p>');
      }
      console.log("Nceno User ID: "+Cookies.get('stravaID')+"   Nceno Email: "+portisEmail+"   Wallet address: "+Cookies.get('userWallet'));
    }
  });
  //using joe nceno 
  xhr.open("POST", 'https://www.strava.com/oauth/token?client_id=33084&client_secret=e4668610b5d6bee15fcd68d0cb88a1f656ae1ad3&code='+code+'&grant_type=authorization_code');
  //xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(stuff);
}

var portisEmail;
//signs user into portis and stores their wallet address as the default wallet address in web3
function showPortisGlobal() {
  $('#loaderGlobal').show();
  setTimeout("$('#loaderGlobal').hide();", 7500);
  // will only open the portis menu
  portis.showPortis(() => {  
  });
  portis.onLogin((walletAddress, email) => {
    web3.eth.getAccounts().then(e => { 
      web3.eth.defaultAccount = e[0];
      portisEmail = email;
      stravaUsername= portisEmail.substring(0, portisEmail.lastIndexOf("@"));
      Cookies.set('stravaUsername', stravaUsername);
      Cookies.set('userWallet', Cookies.get('userWallet'));

      //$("#portisBtn").hide();
      updateGasPrice();

      //if this fills in the blanks for auth creds,
      if(Cookies.get('access_token') != undefined && Cookies.get('stravaID') != undefined){
        //say so.
        $("#userPrompt").html('<h5><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</h5>');
        $("#brandsPrompt").html('<p><font style="color:white;">Connection successful. Welcome, </font>'+Cookies.get('stravaUsername')+'</p>');
      }
      $("#openWalletGlobal2").show();
      
    });
  });
}

function showWallet(){
  $('#loaderGlobal').show();
  setTimeout("$('#loaderGlobal').hide();", 3000);
    portis.showPortis(() => {  
    });
}

///////////////////////////////
//-----/end log-in logic
///////////////////////////////