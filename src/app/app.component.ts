import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { IMessage } from '../interfaces/IMessage';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild('chatContainer', { static: true }) chatContainer!: ElementRef;
  message: string = '';
  messages: IMessage[] = [];

  constructor(private _chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
    this._chatService.connect().subscribe((msg: string) => {
      this._addMessage(msg);
    });
  }

  private _addMessage(msg: string): void {
    const id = this.messages.length + 1;
    const message: IMessage = {
      _id: id.toString(),
      text: msg,
      date: new Date(),
    };
    this.messages.push(message);
    this.scrollToBottom();
  }

  public async loadMessages(): Promise<void> {
    this.messages = await this._chatService.loadMessages();
    this.scrollToBottom();
  }

  public sendMessage(): void {
    this._chatService.sendMessage(this.message);
    this.message = '';
  }

  // Scroll to the bottom of the chat container
  public scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}
