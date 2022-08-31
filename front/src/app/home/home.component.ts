import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileDTO, UserService } from '../api';
import { JwtService } from '../auth/jwt.service';
import { StorageService } from '../global/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loading = true;
  profile?: ProfileDTO;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  ngOnInit(): void {
    this.userService.profile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  logout() {
    this.jwtService.logOut();
    this.router.navigateByUrl('/login');
  }
}
