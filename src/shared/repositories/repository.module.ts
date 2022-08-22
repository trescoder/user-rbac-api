import { Module } from '@nestjs/common';
import { LikeRepositoryService } from './like-repository/like-repository.service';
import { PostRepositoryService } from './post-repository/post-repository.service';
import { UserRepositoryService } from './user-repository/user-repository.service';

@Module({
  imports: [
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
