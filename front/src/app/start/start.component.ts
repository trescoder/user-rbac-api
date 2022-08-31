import { Component, OnInit } from '@angular/core';
import { ProfileDTO, UserService } from '../api';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit {
  loading = true;
  profile?: ProfileDTO;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .profile()
      .subscribe({
        next: (profile) => (this.profile = profile),
      })
      .add(() => (this.loading = false));
  }
}
