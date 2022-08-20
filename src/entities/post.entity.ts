import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeEntity } from './like.entity';
import { UserEntity } from './user.entity';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // creates the inverse relation between user and post
  // this property will hold the id of the entity who created this post
  // "user.posts" makes reference to the "posts" property in the UserEntity which holds an
  // array of PostEntities
  @ManyToOne(() => UserEntity, (user) => user.posts)
  owner: UserEntity;

  // creates a one to many relationship between one post and many likes/dislikes
  // each post can have many likes/dislikes
  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  @Column({ type: 'varchar', length: 100, unique: true })
  content: string;

  @Column({ type: 'date' })
  @CreateDateColumn()
  creation_date: Date;
}
