let activities = ['guitar', 'tm', 'meetup', 'skateboard', 'rollerblade', 'running', 'cooking', 'photo', 'meditate'];
function chooseActivity(){
	let random = Math.floor(Math.random()*Math.floor(activities.length));
	console.log(activities[random]);
	$('#theChoice').html('<p>'+activities[random]+'</p>');
}