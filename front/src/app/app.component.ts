import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from './global/message.service';
import { NewRouteMessage } from './global/messages';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GTESC';
  constructor(private router: Router, private messagesService: MessageService) {
    
    this.router.events.subscribe({
      next: (e) => {
        if (!(e instanceof NavigationEnd)) return;

        this.messagesService.sendMessage(new NewRouteMessage(e.url));
      },
    });
  }

}
