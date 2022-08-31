import { ApiProperty } from '@nestjs/swagger';
import { LikeEntity } from 'src/entities/like.entity';

export class LikeDTO {
  @ApiProperty({ description: 'Amount of likes.' })
  likes = 0;

  @ApiProperty({ description: 'Amount of dislikes' })
  dislikes = 0;

  constructor(likes: LikeEntity[]) {
    likes.forEach((l) => {
      if (l.isLike) this.likes++;
      else this.dislikes++;
    });
  }
}
