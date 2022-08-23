import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from 'src/entities/like.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { LikeRepositoryService } from './like-repository/like-repository.service';
import { PostRepositoryService } from './post-repository/post-repository.service';
import { UserRepositoryService } from './user-repository/user-repository.service';

@Module({
  imports: [
    RepositoryModule,
    TypeOrmModule.forFeature([UserEntity, PostEntity, LikeEntity]),
  ],
  providers: [
    LikeRepositoryService,
    UserRepositoryService,
    PostRepositoryService,
  ],
  exports: [
    LikeRepositoryService,
    UserRepositoryService,
    PostRepositoryService,
  ],
})
export class RepositoryModule {}
