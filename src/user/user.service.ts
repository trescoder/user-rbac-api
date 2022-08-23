import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseInterface } from 'src/shared/interfaces/response';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAccount } from './create-account.interface';
import { hashPassword } from 'src/bcrypt-manager';
import { PostEntity } from 'src/entities/post.entity';
import { UserRepositoryService } from 'src/shared/repositories/user-repository/user-repository.service';
import { PostDTO } from './dto/post.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private dataSource: DataSource,
    private userRepoService: UserRepositoryService,
  ) {}

  async createAccount(accountData: CreateAccount): Promise<ResponseInterface> {
    // encrypt password before store
    accountData.password = hashPassword(accountData.password);

    try {
      await this.userRepository.save(accountData);
      return { status: 200, ok: true, msg: 'User Account Created' };
    } catch (e) {
      return { status: 400, ok: false, msg: e.detail };
    }
  }

  async getUserProfile(user): Promise<ResponseInterface> {
    // retrieving user with posts
    try {
      // this will retrieve an array, but due to the where condition
      const userWithPosts = await this.userRepoService.getUserProfile(user);
      return { ok: true, status: 200, data: userWithPosts };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }

  async savePost(user: any, postContent: string): Promise<ResponseInterface> {
    try {
      // retrieve a user
      const userPosts = await this.userRepository.findOne({
        relations: { posts: true }, // retrieve the posts
        where: { id: user.id }, // specified the user
      });
      // creates a new post
      const post = this.postRepository.create({
        content: postContent,
        owner: userPosts, // binds this post with this user
        likes: [],
      });

      await this.postRepository.save(post); // save the post
      userPosts.posts.push(post); // bind this user with this post
      await this.userRepository.save(userPosts);
      const newPost = new PostDTO(post);

      return {
        status: 201,
        ok: true,
        data: { newPost },
      };
    } catch (error) {
      return { ok: false, status: 500, msg: error.detail };
    }
  }
}
