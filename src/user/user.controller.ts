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
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-in')
  async signIn(@Body() body: CreateAccountDTO, @Res() res: Response) {
    const { status, ...data } = await this.userService.createAccount(body);
    return res.status(status).json(data);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  async profile(@Req() req: Request) {
    return req.user;
  }
}
