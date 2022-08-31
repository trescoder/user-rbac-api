import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Message } from './messages';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private subject = new ReplaySubject<any>();

  sendMessage(message: Message) {
    this.subject.next(message);
  }

  get messages(): Observable<Message> {
    return this.subject.asObservable();
  }
}
