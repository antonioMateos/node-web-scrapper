var socket = io();

socket.on("connect", function(msg){

  console.log("socket ON",msg);

});

// START <> STOP Streaming
// TO DO --> Add key press font intro on search!!!
var ansCounter;

$('#start-btn').click(function(){

	var url = $('#input-url').val(); // <-- Get URL
	var tag = $('#input-tag').val();	// <-- Get HTML TAG
	//console.log("Q",getURL,tag);

	cleanRespBox(); // <-- Clean response box at the begininng

	if(url != "" && tag != ""){

		feedback("pending");
		ansCounter = 0;
		addCount(ansCounter);
		socket.emit('start',url,tag); 	// Send DATA to server Scrap

	} else {

		feedback("error001");

	}

});

socket.on("response", function(newResp){

  processAnswer(newResp);
  stats(); // Number of answers

});

//PRINT CALL ANSWER
function processAnswer(data){

	if(data != ""){

	feedback("success");	
	console.log(data);

	var l = data.length;

	for(var i=0; i<l; i++){
		//console.log(data[i].id,data[i].nombre);
		$('.counter').show();
		printAnswer(data[i]);
	}

	}else{
		feedback("error002");
	}

	//$('#response p').prepend('<span class="answer">'+JSON.stringify(responseTemplate)+"</span>"); // FOR PROTOTYPE PURPOSES ONLY
}

function printAnswer(data){
	ansCounter = ansCounter + 1;
	addCount(ansCounter);
	//console.log(c);
	$('#response').append('<p class="answer">'+data+"</p>");
	// PLAYA ESPECIFICO
	//$('#response').append('<p class="answer">'+data.id+" : <b>"+data.nombre+"</b></p>");
}

$('#stop-btn').click(function(){
	$('#search').val("");
	socket.emit('stop');
	$('main').removeClass('searching'); // CHANGE STYLE TO START STREAMING
	responseMsg("stop");
});

// STATS Fn
var nt = 0; // Number of answers received
function stats() {
	$('.stats').show(); // show STATS
	nt += 1;
	$('.stats p span').text(nt);
}

function addCount(counter){
	$('.counter p span').text(counter);
}

// REFRESH Tw List
function cleanRespBox() {
	//Refresh ul tweetList
	$('#response').html("");
};

//FEEDBACK 
function feedback(type){

	$('.feedback h5').removeClass(); // Remove all classes!

	var msg;

	if(type==="error001"){
		type = "error";
		msg = "ERROR!: Empty inputs!";
	}

	if(type==="error002"){
		type = "error";
		msg = "SORRY! Nothing matches your query!";
	}

	if(type==="success"){
		msg = "SUCCESS!";
	}

	if(type==="pending"){
		msg = "Please, wait...";
	}

	$('.feedback h5').text(msg);
	type = "title "+type;
	$('.feedback h5').addClass(type);

}