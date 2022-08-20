import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local.guard';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req) {
    return req.user;
  }
}
