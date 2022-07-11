import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { EventsService } from '../events/events.service';
import { INTERNAL_YACK_MESSAGE, YACK_SYSTEM } from "../constants";
import { IEvent } from "../types/IEvent";

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() server;
  users: number = 0;

  afterInit() {
    EventsService.getInstance().get().on(INTERNAL_YACK_MESSAGE, (payload: IEvent) => {
      const { destination } = payload;
      console.log('Just received this from inside the API, notifying the frontend for topic: ' + destination);
      this.server.emit(destination, payload);
    })
  }

  async handleConnection(){
    this.users++;
  }

  async handleDisconnect(){
    this.users--;
  }

  @SubscribeMessage(YACK_SYSTEM)
  async onChat(client, message){
    // Not working
    // client.broadcast.emit('chat', message);
    this.server.emit(YACK_SYSTEM, message);
  }
}
