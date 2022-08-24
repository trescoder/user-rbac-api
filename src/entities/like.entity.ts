import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // creates the inverse relation between user and post
  // one like/dislike can belong to only one post
  @ManyToOne(() => PostEntity, (post) => post.likes)
  post: PostEntity;

  @Column()
  userId: number;

  @Column()
  isLike: boolean; // true = like, false = dislike
}
