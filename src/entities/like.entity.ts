import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // creates the inverse relation between user and post
  // one like/dislike can belong to only one post
  // onDelete: 'CASCADE', this allow us to delete a post and all its relate like entities
  @ManyToOne(() => PostEntity, (post) => post.likes, { onDelete: 'CASCADE' })
  post: PostEntity;

  @Column()
  userId: number;

  @Column()
  isLike: boolean; // true = like, false = dislike
}
