import { ApiProperty } from '@nestjs/swagger';
import { PostDTO } from './post.dto';

export class PostPageDto {
  @ApiProperty({
    description: 'Items in this page.',
    type: [PostDTO],
  })
  items: PostDTO[];

  @ApiProperty({
    description: 'Total items.',
  })
  count: number;
}
