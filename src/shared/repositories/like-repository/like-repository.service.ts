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
    try {
      const post = await this.postRepository.findOne({
        relations: { likes: true },
        where: { id: postId },
      });

      // check if the suer already liked/disliked the post
      if (post.likes.some((l) => l.userId === userId)) {
        const userLike = post.likes.find((l) => l.userId === userId);
        // check if the user is removing his like/dislike

        if (userLike.isLike === like) {
          await this.removeLike(userLike.id);
          return { msg: 'like/dislike removed' };
        } else {
          // here switches from like to dislike or vice versa
          userLike.isLike = like;
          await this.likeRepository.save(userLike);
          return { msg: 'like/dislike switch' };
        }
      } else {
        // first time liking/disliking
        const likeEntity = new LikeEntity();
        likeEntity.isLike = like;
        likeEntity.post = post;
        likeEntity.userId = userId;

        await this.likeRepository.save(likeEntity);
        post.likes.push(likeEntity);
        await this.postRepository.save(post);
        return { msg: 'new like/dislike added' };
      }
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  }

  async removeLike(id: number) {
    try {
      const like = await this.likeRepository.findOneBy({ id });
      await this.likeRepository.delete(like);
    } catch (error) {
      console.log(error);

      throw new Error(error);
    }
  }
}
