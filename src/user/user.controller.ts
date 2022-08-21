import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/jwt-strategy/jwt.guard';
import { CreateAccountDTO } from './dto/create-account.dto';
import { CreatePostDTO } from './dto/create-post.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  async profile(@Req() req: Request, @Res() res: Response) {
    // req.user hold whatever the jwt strategy returns, in this case is the email inside an object {email}
    // TODO: use express to send back the response
    const { status, ...data } = await this.userService.getUserProfile(req.user);
    return res.status(status).json(data);
  }

  @Post('sign-in')
  async signIn(@Body() body: CreateAccountDTO, @Res() res: Response) {
    const { status, ...data } = await this.userService.createAccount(body);
    return res.status(status).json(data);
  }

  @Post('add-post')
  @UseGuards(JwtGuard)
  async addPost(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePostDTO,
  ) {
    const { user } = await this.userService.findUser(req.user);
    const { status, ...data } = await this.userService.savePost(
      user,
      body.content,
    );
    // TODO: use express to send back the response
    return res.status(status).json(data);
  }
}
