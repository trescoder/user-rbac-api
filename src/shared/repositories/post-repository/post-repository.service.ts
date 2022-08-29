import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PostRepositoryService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async getPost(id: number) {
    const post = await this.postRepository.findOneBy({ id });
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
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.likes', 'like')
      .where('post.id IN(:...postIds)', { postIds })
      .orderBy({ 'post.creation_date': 'DESC' })
      .getMany();
  }

  async deletePost(id: number) {
    await this.postRepository.delete(id);
    return { msg: 'post deleted successfully' };
  }
}
