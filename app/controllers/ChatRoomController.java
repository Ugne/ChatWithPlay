package controllers;

import models.ChatRoom;
import play.mvc.Controller;
import play.mvc.LegacyWebSocket;
import play.mvc.Result;
import play.mvc.WebSocket;
import views.html.chatRoom;

public class ChatRoomController extends Controller {

    public Result chatRoom() {
        return ok(chatRoom.render(request()));
    }
    
    public Result javascriptRoutes() {
        return ok(play.routing.JavaScriptReverseRouter.create("jsRoutes",
                        routes.javascript.ChatRoomController.socket())).as("text/javascript");
    }
    
    public LegacyWebSocket<String> socket() {
        return WebSocket.withActor(ChatRoom::props);
    }	
}
