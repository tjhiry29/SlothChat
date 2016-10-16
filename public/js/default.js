//Front end Javascript

function presentLogIn(){

}

function presentChat(){
	
}

function postUserMessage(text) { 
	$("#message").val('');
	$(".message-container").append("<div class='message user-message'>" + marked(text) + "</div>");
}

function postMessage(text) {
	$(".message-container").append("<div class='message'>" + marked(message) + "</div>")
}