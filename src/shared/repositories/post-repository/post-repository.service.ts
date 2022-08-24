import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PostRepositoryService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async createPost(properties: any) {
    const post = new PostEntity();
    post.content = properties.content;
    post.owner = properties.owner;
    post.likes = [];
    return this.savePost(post);
  }

  async savePost(post: PostEntity) {
    return await this.postRepository.save(post);
  }

  async getPostsWithLikes(postIds: number[]) {
    return await this.postRepository.find({
      relations: { likes: true },
      where: { id: In(postIds) },
    });
  }
}
