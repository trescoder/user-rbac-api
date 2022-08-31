import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { FindManyOptions, In, Repository } from 'typeorm';

@Injectable()
export class PostRepositoryService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  findAndCount(opts: FindManyOptions<PostEntity>) {
    return this.postRepository.findAndCount({
      ...opts,
      relations: { likes: true },
    });
  }

  async getPost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { likes: true },
    });
    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return post;
  }

  async checkPostExistence(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    return post !== null;
  }

  async createPost(properties: any) {
    const post = new PostEntity();
    post.content = properties.content;
    post.owner = properties.owner;
    post.likes = [];
    return post;
  }

  async savePost(post: PostEntity) {
    try {
      return this.postRepository.save(post);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async getPostsWithLikes(postIds: number[]) {
    return await this.postRepository.find({
      relations: { likes: true },
      where: { id: In(postIds) },
    });
  }

  async deletePost(id: number) {
    await this.postRepository.delete(id);
    return { msg: 'post deleted successfully' };
  }
}
