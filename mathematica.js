var failRate = 0.15;
var weeks = 4;
var ses = 3;
var ppl = 9;
var lim = 3;
var cost = 10;
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
[[0, 1, 0, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 1, 0, 0, 1, 0, 0],
[0, 0, 0, 1, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 0, 0, 0, 0, 0, 0, 0],
[0, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 1, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0]];


var strikes = new Array(ppl).fill(0); //fails per person
var winners = new Array(weeks).fill(0); //winners per week
var pot =new Array(weeks).fill(0); //lost stake per week
var payouts = new Array(weeks).fill(0); //individual payouts per person per week
var revenue = 0; //nceno's revenue per goal

for(var p=1; p<ppl+1; p++){
	for(var w= 1; w < weeks+1; w++){
		if(strikes[p-1]<lim){
			var prevStrikes = strikes[p-1];
			var failSum = 0;
			for(var x= (w-1)*ses+1; x < w*ses+1; x++){
				failSum+=fails[x-1][p-1];
			}
			if(failSum == 0){
				winners[w-1]++;
			}
			else{
				strikes[p-1] += failSum;

				//beginning of problem
				for(var f=prevStrikes+1; f<strikes[p-1]+1; f++){
					console.log('f= '+f);
					pot[w-1]+= 0.01*perc[lim-1][f-1]*(cost*lim);
				}
			}
		}
	}
}


for(var w=0; w<weeks; w++){
	payouts[w] = 0.5*pot[w]/winners[w];
	revenue += 0.5*pot[w];
}

for(var k= 0; k<weeks; k++){
	pot[k] = pot[k].toFixed(2);
	payouts[k] = payouts[k].toFixed(2);
}
console.log('strikes is: '+strikes);
console.log('winners is: '+winners);
console.log('pot is: '+pot);
console.log('payouts is: '+payouts);
console.log('revenue is: '+revenue.toFixed(2));

