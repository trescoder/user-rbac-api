import { IsEmail, isEmail } from 'class-validator';
import { Roles } from 'src/roles';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @IsEmail()
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.user,
  })
  role: Roles;

  @Column({ type: 'boolean', default: false })
  blocked: boolean;

  // creates a relation between one user and many posts
  // "post.owner_id" makes reference to the "owner_id" in the PostEntity
  @OneToMany(() => PostEntity, (post) => post.owner)
  posts: PostEntity[];
}
