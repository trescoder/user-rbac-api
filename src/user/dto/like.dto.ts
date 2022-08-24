import { LikeEntity } from 'src/entities/like.entity';

export class LikeDTO {
  likes = 0;
  dislikes = 0;

  constructor(likes: LikeEntity[]) {
    likes.forEach((l) => {
      if (l.isLike) this.likes++;
      else this.dislikes++;
    });
  }
}
