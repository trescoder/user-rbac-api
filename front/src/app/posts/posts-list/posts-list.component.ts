import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PostDTO, UserService } from 'src/app/api';
import { PostPageDto } from 'src/app/api/model/postPageDto';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements AfterViewInit {
  isLoading = true;
  pageSize = 10;
  currentPage = 0;
  page?: PostPageDto;
  displayedColumns: (keyof PostDTO | 'actions')[] = ['content', 'actions'];
  dataSource: MatTableDataSource<PostDTO> = new MatTableDataSource();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  importErrorMessages: { name: string; err: string }[] = [];

  constructor(
    private userService: UserService,
    private snackbar: MatSnackBar,
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.loadData();
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.userService.listPosts(0, 10).subscribe({
      next: (posts) => {
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = 10;
        this.dataSource.data = posts.items;
        this.page = posts;
      },
      complete: () => (this.isLoading = false),
    });
  }

  remove(id: number) {
    this.isLoading = true;
    this.userService
      .deletePost({ postId: id })
      .subscribe({
        next: () => {
          this.loadData();
        },
        error: (e) => {
          if (e instanceof HttpErrorResponse && e.error.message)
            this.snackbar.open(e.error.message, undefined, { duration: 2000 });
        },
      })
      .add(() => (this.isLoading = false));
  }
}
