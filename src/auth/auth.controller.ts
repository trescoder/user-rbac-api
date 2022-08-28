import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './jwt-strategy/public.decorator';
import { LocalGuard } from './local-strategy/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalGuard)
  @Post('sing-in')
  async login(@Req() req, @Res() res: Response) {
    // req.user is return from the local strategy, it contains the user's email and password
    const token = await this.authService.login(req.user);
    return res.status(200).json(token);
  }
}
