///////////////////////////////////////
//////////////vvvvvvvvvv gapAdjust()
///////////////////////////////////////


//_actID --> activeTime0, adjHR1
async function gapAdjust(_actID){
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

      //---- /gap detection -----
    } 
  });
  xhr2.open("GET", 'https://www.strava.com/api/v3/activities/'+_actID+'/streams?keys=heartrate,time&series_type=time&key_by_type=true');
  xhr2.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
  xhr2.send(stuff2);
}
///////////////////////////////////////
//////////////^^^^^^^^^^ gapAdjust()
///////////////////////////////////////








///////////////////////////////////////
//////////////vvvvvvvvv getActivities()
///////////////////////////////////////
var speedLimit = 4.5; //in m/s
var speedLow = 1.4; //in m/s
var BPMthresh = 99; 
var sesLow = 1200; //in s
var HRreward = 3;
var KMreward = 1;
var placeholderDate = new Date();
placeholderDate.setDate(placeholderDate.getDate() - 56); //can change "1" day to "20" days for testing.
var yesterday =parseInt(parseInt(placeholderDate.getTime())/1000);
var nowDate = parseInt(parseInt(new Date().getTime())/1000);

var HR = new Array();  //ID0, avgHR1,    mins2, timestamp3, reward4, valid5
var GPS = new Array(); //ID0, avgSpeed1, dist2, timestamp3, reward4, valid5
var toLog = new Array(3);


//---- start the function
async function getActivities(){
  var stuff = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  await xhr.addEventListener("readystatechange", async function(){
    if (this.readyState === 4) {
      console.log(this.responseText);
      var data = JSON.parse(xhr.responseText);
      console.log("number of workouts is: "+data.length);
      //clean the data and make a list of valid workouts.
      /*var HR = new Array();  //ID0, avgHR1,    mins2, timestamp3, reward4, valid5
      var GPS = new Array(); //ID0, avgSpeed1, dist2, timestamp3, reward4, valid5*/
      let i=0;
      let j=0;
      let k=0;
      
      while(i<data.length){
        if(data[i].manual == false && data[i].has_heartrate == true){
          var HRvalid= false;
          if(data[i].average_heartrate>BPMthresh && data[i].elapsed_time>sesLow) {HRvalid =true;}
          HR.push([data[i].id, data[i].average_heartrate, data[i].elapsed_time, data[i].start_date, HRreward*data[i].elapsed_time/600, HRvalid]); //need to adjust time, hr, value, validity
          j++;
        }
        if(data[i].manual == false && data[i].distance > 0){
          var GPSvalid= false;
          if(data[i].distance>1000 && data[i].average_speed<speedLimit && data[i].average_speed>speedLow) {GPSvalid =true;}
          GPS.push([data[i].id, data[i].average_speed, data[i].distance, data[i].start_date, KMreward*data[i].distance/1000, GPSvalid]);
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

      //find the max
      var GPSMaxID = null;
      var hrMaxID = null;
      var hrMaxVal=0;
      var GPSMaxVal=0;

      var avgHRmax = 0;
      var elapsed_timeMax = 0;
      var timestampMax = null;
      var avgSpeedMax = 0;
      var distMax = 0;

      if(j>0){
        HR.forEach(function(_H){
          if(_H[5]==true && _H[4]>hrMaxVal){
            hrMaxID = _H[0];
            hrMaxVal=_H[4];
          }
        });
      }

      //loop through GPS[m]
      if(k>0){
        GPS.forEach(function(_G){
          if(_G[5]==true && _G[4]>GPSMaxVal){
            GPSMaxID = _G[0];
            GPSMaxVal=_G[4];
          }
        });
      }

      //compare the max values and return the id of the best one
      var bestID = null;
      var bestVal = 0;
      var identifier = null;

      if(GPSMaxVal>=hrMaxVal){
        bestVal = GPSMaxVal;
        bestID = GPSMaxID;
        identifier = "GPS";
      }
      else {
        bestVal = hrMaxVal;
        bestID = hrMaxID;
        identifier = "HR";
      }
      console.log("the best one is a "+identifier+" workout: "+bestID+", which is worth "+Math.round(bestVal)+" SUN tokens");

      //get the full details of that activity
      var dispHR;
      var dispMins;
      var dispTimeHours;
      var dispTimeMinutes;
      var dispSpeed;
      var dispDist;
      var dispValue;
      var period;

      data.forEach(function(_A){
        if(_A.id==bestID){
          //console.log(_A);
          dispHR = _A.average_heartrate; //needs to be adjusted
          dispMins = _A.elapsed_time; //may need adjusted
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
          _A.utc_offset/3600
          dispTimeMinutes = new Date(_A.start_date_local).getMinutes();
          dispSpeed = _A.average_speed;
          dispDist = _A.distance;
          dispValue = Math.round(bestVal);
        }
      });
      //console.log("display this: "+dispTime+" "+dispMins+" "+dispHR+" "+dispDist+" "+dispSpeed+" "+dispValue);
      if(dispHR!= null && dispHR!= 0) $("#dispHR").html(Math.round(dispHR)); 
      if(dispMins!= null && dispMins!= 0) $("#dispMins").html(Math.round(dispMins/60));
      $("#dispTime").html(dispTimeHours+':'+dispTimeMinutes);
      $("#period").html(period); 
      if(dispSpeed!= null && dispSpeed!= 0) $("#dispSpeed").html((dispSpeed*3.6).toFixed(1));
      if(dispDist!= null && dispDist!= 0) $("#dispDist").html((dispDist/1000).toFixed(1)); 
      $("#dispValue").html(dispValue); 
    }
  });
  xhr.open("GET", 'https://www.strava.com/api/v3/athlete/activities?before='+nowDate+'&after='+yesterday);
  xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('access_token'));
  xhr.send(stuff);
}

///////////////////////////////////////
//////////////^^^^^^^^^^ getActivities()
///////////////////////////////////////