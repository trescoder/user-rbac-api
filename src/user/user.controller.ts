import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/auth/jwt-strategy/public.decorator';
import { AllowedRoles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/roles';
import { CreateAccountDTO } from './dto/create-account.dto';
import { CreateLikeDTO } from './dto/create-like.dto';
import { CreatePostDTO } from './dto/create-post.dto';
import { UserService } from './user.service';

@Controller('user')
@AllowedRoles(Roles.user)
@UseGuards(RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async profile(@Req() req: Request, @Res() res: Response) {
    // req.user hold whatever the jwt strategy returns, in this case is the email inside an object {email}
    const { status, ...data } = await this.userService.getUserProfile(req.user);
    return res.status(status).json(data);
  }

  @Post('sign-in')
  @Public() // this will be use by the jwt guard to determine if it is a public route or not
  async signIn(@Body() body: CreateAccountDTO, @Res() res: Response) {
    const { status, ...data } = await this.userService.createAccount(body);
    return res.status(status).json(data);
  }

  @Post('add-post')
  async addPost(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePostDTO,
  ) {
    const { status, ...data } = await this.userService.savePost(
      req.user,
      body.content,
    );
    return res.status(status).json(data);
  }

  @Put('update-post')
  async updatePost(@Res() res: Response, @Body() body) {
    const { status, msg, data } = await this.userService.updatePost(
      body.postId,
      body.content,
    );
    return res.status(status).json({ msg, data });
  }

  @Post('add-like')
  async addLike(@Body() body: CreateLikeDTO, @Res() res: Response) {
    const { status, data, msg } = await this.userService.addLike({ ...body });
    return res.status(status).json({ data, msg });
  }

  @Delete('delete-post')
  async deletePost(@Body() body, @Res() res: Response) {
    const { status, msg, data } = await this.userService.deletePost(
      body.postId,
    );
    return res.status(status).json({ msg, data });
  }

  @Delete('delete-account')
  async deleteAccount(@Body() body, @Res() res: Response) {
    const { msg, data, status } = await this.userService.deleteAccount(
      body.accountId,
    );
    return res.status(status).json({ msg, data });
  }
}
