import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/global/message.service';
import { NewRouteMessage } from 'src/app/global/messages';

interface Item {
  name: string;
  title: string;
  path: string;
  icon: string;
  selected?: boolean;
}

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.css'],
})
export class StartMenuComponent implements OnInit {
  items: Item[] = [
    {
      name: 'DASHBOARD',
      title: 'Start',
      path: '/',
      icon: 'home',
    },
    {
      name: 'POSTS',
      title: 'Posts',
      path: '/posts',
      icon: 'article',
    },
  ];

  constructor(private messagesService: MessageService) {}

  ngOnInit(): void {
    this.messagesService.messages.subscribe({
      next: (m) => {
        if (!(m instanceof NewRouteMessage)) {
          return;
        }
        const currentPath = m.newPath.includes('?')
          ? m.newPath.substring(0, m.newPath.indexOf('?'))
          : m.newPath;
        this.items = this.items.map((it) => ({
          ...it,
          selected:
            it.path === '/'
              ? currentPath === it.path
              : currentPath.startsWith(it.path),
        }));
      },
    });
  }
}
