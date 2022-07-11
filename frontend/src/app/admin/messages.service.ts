import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class MessagesService {

  constructor(private socket: Socket) {}

  sendMessage(destination: string, message: string) {
    this.socket.emit(destination, message);
  }

  receiveMessage(destination: string) {
    return this.socket.fromEvent(destination);
  }
}
