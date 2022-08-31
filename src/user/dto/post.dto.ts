import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from 'src/entities/post.entity';
import { LikeDTO } from './like.dto';

export class PostDTO {
  @ApiProperty({
    description: 'Post content.',
  })
  content: string;

  @ApiProperty({ description: 'Post ID' })
  id: number;

  @ApiProperty({ description: 'Creation Date' })
  creation_date: Date;

  @ApiProperty({ description: 'Post likes', type: LikeDTO })
  likes: LikeDTO;

  constructor(post: PostEntity) {
    this.id = post.id;
    this.content = post.content;
    this.creation_date = post.creation_date;
    this.likes = new LikeDTO(post.likes);
  }
}
