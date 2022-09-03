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

  async updateLikes({ postId, userId, like }) {
    const post = await this.postRepository.findOne({
      relations: { likes: true },
      where: { id: postId },
    });

    // check if the user already liked/disliked the post
    if (post.likes.some((like) => like.userId === userId)) {
      const userLikeEntity = post.likes.find((like) => like.userId === userId);

      // check if the user is removing his like/dislike
      if (userLikeEntity.isLike === like) {
        await this.removeLike(userLikeEntity.id);
        return { msg: 'like/dislike removed' };
      } else {
        // here switches from like to dislike or vice versa
        userLikeEntity.isLike = like;
        await this.likeRepository.save(userLikeEntity);
        return { msg: 'like/dislike switch' };
      }
    } else {
      // first time liking/disliking
      const likeEntity = await this.createLikeEntity({ like, post, userId });
      await this.likeRepository.save(likeEntity);
      post.likes.push(likeEntity);
      await this.postRepository.save(post);
      return { msg: 'new like/dislike added' };
    }
  }

  async removeLike(id: number) {
    const like = await this.likeRepository.findOneBy({ id });
    await this.likeRepository.delete(like);
  }

  async createLikeEntity({ like, post, userId }) {
    const likeEntity = new LikeEntity();
    likeEntity.isLike = like;
    likeEntity.post = post;
    likeEntity.userId = userId;
    return likeEntity;
  }
}
