var failRate = 0.15;
var weeks = 4;
var ses = 3;
var ppl = 10;
var lim = 2;
var cost = 7;
var perc = 
	[[100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
     [31, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
     [19, 36, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
     [16, 15, 30, 39, 0, 0, 0, 0, 0, 0, 0, 0], 
     [13, 8, 26, 20, 33, 0, 0, 0, 0, 0, 0, 0], 
     [11, 8, 12, 24, 18, 28, 0, 0, 0, 0, 0, 0], 
     [9, 9, 5, 20, 16, 19, 23, 0, 0, 0, 0, 0], 
     [8, 9, 4, 11, 19, 11, 21, 19, 0, 0, 0, 0], 
     [7, 8, 4, 5, 15, 15, 9, 21, 15, 0, 0, 0], 
     [6, 7, 5, 3, 10, 16, 10, 9, 20, 13, 0, 0], 
     [5, 6, 5, 2, 6, 13, 14, 7, 11, 19, 11, 0], 
     [5, 6, 6, 3, 3, 9, 13, 10, 6, 12, 18, 10]];

//rows are workouts, columns are players counts[exercises][players]
var fails = 
[[0, 0, 0, 0, 0, 0, 0, 1, 0, 0], 
 [0, 0, 0, 0, 0, 1, 0, 0, 1, 0], 
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

 [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], 
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
 [1, 0, 0, 0, 0, 0, 1, 1, 0, 0],

 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
 [0, 0, 1, 0, 1, 0, 1, 0, 0, 0], 
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0]];


var strikes = new Array(ppl).fill(0); //fails per person
var winners = new Array(weeks).fill(0); //winners per week
var pot =new Array(weeks).fill(0); //lost stake per week
var payouts = new Array(weeks).fill(0); //individual payouts per person per week
var revenue = 0; //nceno's revenue per goal

for(var p=0; p<ppl; p++){
	for(var w= 0; w < weeks; w++){
		console.log('strikes['+p+'] is: '+strikes[p]);
		if(strikes[p]<lim){
			var prevStrikes = strikes[p];
			var failSum = 0;
			for(var x= (w-0)*ses; x < w*ses+1; x++){
				failSum+=fails[x][p];
				console.log('fails['+x+']['+p+'] is: '+fails[x][p]);
			}
			if(failSum == 0){winners[w]++;}
			else{
				strikes[p] += failSum;
				for(var f=prevStrikes; f<strikes[p]+1; f++){
					pot[w]+= 0.01*perc[lim][f]*cost*lim;
				}
			}
		}
	}
}
console.log('pot is: '+pot);

for(var w=0; w<weeks; w++){
	payouts[w] = 0.5*pot[w]/winners[w];
	revenue += 0.5*pot[w];
}

