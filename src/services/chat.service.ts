import { Injectable } from '@angular/core';
import { IMessage } from '../interfaces/IMessage';
import axios from 'axios';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _serverUri = 'http://localhost:3000';
  private _socket;

  constructor() {
    this._socket = io("ws://localhost:3000");
  }

  public async loadMessages(): Promise<IMessage[]> {
    const response = await axios.get(`${this._serverUri}/api/chat`);
    const messages = response.data;
    return messages;
  }

  public connect(): Observable<string> {
    return new Observable((observer) => {
      this._socket.on('message', (msg: string) => {
        observer.next(msg);
      });
    });
  }

  public sendMessage(message: string): void {
    if (message) {
      this._socket.emit('message', message);
    }
  }


}
