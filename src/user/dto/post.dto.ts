import { PostEntity } from 'src/entities/post.entity';

export class PostDTO {
  content: string;
  id: number;
  creation_date: Date;

  constructor(Post: PostEntity) {
    this.id = Post.id;
    this.content = Post.content;
    this.creation_date = Post.creation_date;
  }
}
