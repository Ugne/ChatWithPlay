$('document').ready(function(){
	$('#btn-input').focus();
	$('.login').on('click', function(){
		var myUsername = $('#btn-input').val();
		if(myUsername.length === 0)
			return;
		
		$(this).removeClass('login');
		$(this).addClass('logout btn-default');
		$(this).text('Logout');
		$('#btn-input').attr("placeholder", "Type your message here...");
		$('#btn-input').val('');
		  
	      var websocketURL = jsRoutes.controllers.ChatRoomController.socket().webSocketURL();
	      var websocket = new WebSocket(websocketURL);
	      
	      websocket.onopen = function(){	    	  
	         websocket.send(JSON.stringify({
	        	  username: myUsername,
	        	  system_message: myUsername+" has joined",
	        	  time: new Date().toLocaleTimeString()
	         }));
	      };
	      
	      websocket.onmessage = function (event){ 
	         var received_msg = JSON.parse(event.data);
	         var template;
	         var isMine = received_msg.username === myUsername;	         
	         if(received_msg.system_message !== undefined){
	        	 template = isMine ? $('#system-my-message').html() : $('#system-user-message').html();
	         }else{
	        	 template = isMine ? $('#my-message').html() : $('#user-message').html();
	         }
	         var rendered = Mustache.render(template, received_msg);
	         $('.chat').append(rendered);
	      };			
	      
	     $('#btn-input').focus();
	     $('#btn-input').on('keyup', function(e){
	         if( e.keyCode != 13)
	       	  return;
	         websocket.send(JSON.stringify({
	        	  username: myUsername,
	        	  initial: myUsername.charAt(0).toUpperCase(),
	        	  message: $(this).val(),
	        	  time: new Date().toLocaleTimeString(),
	        	  color: $('#color').val().substring(1)
	         }));
	       	$(this).val('')
	     });
	     
	     $('.logout').on('click', function(){
	    	 //Chrome doesn't close the websocket when page is reloaded => onclose is not triggered
	         websocket.send(JSON.stringify({
	        	  username: myUsername,
	        	  system_message: myUsername+" has left",
	        	  time: new Date().toLocaleTimeString()
	         }));
	         websocket.close();
	    	 location.reload(); 
	     });
	});
});