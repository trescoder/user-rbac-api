import { PostEntity } from 'src/entities/post.entity';
import { LikeDTO } from './like.dto';

export class PostDTO {
  content: string;
  id: number;
  creation_date: Date;
  likes: LikeDTO;

  constructor(post: PostEntity) {
    this.id = post.id;
    this.content = post.content;
    this.creation_date = post.creation_date;
    this.likes = new LikeDTO(post.likes);
  }
}
