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
    return this.postRepository.create(properties).at(0);
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
