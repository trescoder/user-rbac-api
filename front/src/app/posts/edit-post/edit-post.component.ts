import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/api';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
  id = parseInt(this.route.snapshot.queryParams['id'], 10);
  loading = true;
  form: FormGroup = this.formBuilder.group({
    content: ['', Validators.required],
  });

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private matSnackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.form.disable();
    this.userService
      .getPostById(this.id)
      .subscribe({
        next: (post) => {
          this.form.setValue({
            ...this.form.value,
            ...post,
          });
        },
        error: () => {
          this.matSnackbar.open(
            'Error loading post, try again later.',
            undefined,
            { duration: 2000 },
          );
        },
      })
      .add(() => {
        this.loading = false;
        this.form.enable();
      });
  }

  save() {
    this.loading = true;
    this.form.disable();
    this.userService
      .updatePost({
        ...this.form.value,
        postId: this.id,
      })
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
