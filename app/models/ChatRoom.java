package models;

import java.util.HashSet;
import java.util.Set;

import akka.actor.ActorRef;
import akka.actor.Props;
import akka.actor.Terminated;
import akka.actor.UntypedActor;
public class ChatRoom extends UntypedActor {

    private static final Set<ActorRef> senders = new HashSet<>();
	
    public static Props props(ActorRef actor) {
        return Props.create(ChatRoom.class, actor);
    }

    private final ActorRef actor;
    
    public ChatRoom(ActorRef actor) {
    	this.actor = actor;
    }
    
    private class JoinMessage{}
    
    @Override
    public void preStart() {
		getSelf().tell(new JoinMessage(), getSelf());
    }
    
    private void addSender(ActorRef actorRef){
        senders.add(actorRef);
    }

    private void removeSender(ActorRef actorRef){
        senders.remove(actorRef);
    }
    
    @Override
    public void onReceive(Object message) throws Exception {
	if (message instanceof JoinMessage) {
		addSender(actor);
		getContext().watch(actor);
	}else if (message instanceof String) {
            for (ActorRef sender : senders) {
                sender.tell(message, getSelf());
            }
	}else if(message instanceof Terminated){
			removeSender(sender());
        }else{
        	unhandled(message);
        }
    }
}
