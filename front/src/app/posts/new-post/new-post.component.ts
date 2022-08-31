import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/api';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  loading = false;
  form: FormGroup = this.formBuilder.group({
    content: ['', Validators.required],
  });

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  save() {
    this.loading = true;
    this.form.disable();
    this.userService
      .addPost(this.form.value)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/posts');
        },
      })
      .add(() => {
        this.form.enable();
        this.loading = false;
      });
  }
}
