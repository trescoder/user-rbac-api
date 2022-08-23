import { UserEntity } from 'src/entities/user.entity';
import { PostDTO } from './post.dto';

export class ProfileDTO {
  id: number;
  username: string;
  email: string;
  role: string;
  posts: PostDTO[] = [];

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;

    for (let i = 0; i < user.posts.length; i++) {
      this.posts[i] = new PostDTO(user.posts[i]);
    }
  }
}
