import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { Public } from 'src/auth/jwt-strategy/public.decorator';
import { AllowedRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/roles';
import { CreateAccountDTO } from './dto/create-account.dto';
import { CreateLikeDTO } from './dto/create-like.dto';
import { CreatePostDTO } from './dto/create-post.dto';
import { UserService } from './user.service';

@Controller('user')
@AllowedRoles(Roles.admin, Roles['semi-admin'], Roles.user)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async profile(@Req() req) {
    // req.user hold whatever the jwt strategy returns, in this case is the user email and the user id
    return this.userService.getUserProfile(req.user.id);
  }

  @Post('sign-up')
  @Public() // this will be use by the jwt guard to determine if it is a public route or not
  async signIn(@Body() body: CreateAccountDTO) {
    return this.userService.createAccount(body);
  }

  @Post('add-post')
  async addPost(@Req() req, @Body() body: CreatePostDTO) {
    return this.userService.addPost(req.user, body.content);
  }

  @Put('update-post')
  async updatePost(@Body() body) {
    return this.userService.updatePost(body.postId, body.content);
  }

  @Post('add-like')
  async addLike(@Body() body: CreateLikeDTO) {
    return this.userService.addLike(body);
  }

  @Delete('delete-post')
  async deletePost(@Body() body) {
    return this.userService.deletePost(body.postId);
  }

  @Delete('delete-account')
  async deleteAccount(@Body() body) {
    return this.userService.deleteAccount(body.accountId);
  }
}
