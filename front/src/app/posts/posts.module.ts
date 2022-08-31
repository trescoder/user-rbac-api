import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPostComponent } from './edit-post/edit-post.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { GlobalModule } from '../global/global.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [EditPostComponent, NewPostComponent, PostsListComponent],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild([
      {
        path: '',
        component: PostsListComponent,
      },
      {
        path: 'new-post',
        component: NewPostComponent,
      },
      {
        path: 'edit-post',
        component: EditPostComponent,
      },
    ]),
  ],
})
export class PostsModule {}
