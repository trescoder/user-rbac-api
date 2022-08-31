import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user.entity';
import { PostDTO } from './post.dto';

export class ProfileDTO {
  @ApiProperty({
    description: 'Profile ID',
  })
  id: number;

  @ApiProperty({
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    description: 'User Email',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
  })
  role: string;

  @ApiProperty({
    description: 'User posts.',
    type: [PostDTO],
  })
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
