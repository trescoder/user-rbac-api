import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../api/api/auth.service';
import { JwtService } from '../auth/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    username: [''],
    password: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login() {
    this.authService.login(this.form.value).subscribe({
      next: (result) => {
        this.jwtService.saveToken(result.access_token);
        this.router.navigateByUrl('/');
      },
    });
  }
}
