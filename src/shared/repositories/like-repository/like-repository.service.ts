import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from 'src/entities/like.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,
  ) {}

  async savePost({ postId, userId, like }) {
    try {
      const post = await this.postRepository.findOne({
        relations: { likes: true },
        where: { id: postId },
      });

      const likeEntity = new LikeEntity();
      likeEntity.isLike = like;
      likeEntity.post = post;
      likeEntity.userId = userId;

      await this.likeRepository.save(likeEntity);
      post.likes.push(likeEntity);
      await this.postRepository.save(post);
    } catch (error) {
      throw new Error(error);
    }
  }
}
