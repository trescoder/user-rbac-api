import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { TokenDto } from './dto/TokenDto';
import { Public } from './jwt-strategy/public.decorator';
import { LocalGuard } from './local-strategy/local.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    type: LoginDto,
    description: 'Login credentials.',
  })
  @ApiCreatedResponse({ description: 'login successful.', type: TokenDto })
  @Public()
  @UseGuards(LocalGuard)
  @Post('sing-in')
  async login(@Req() req, @Res() res: Response) {
    // req.user is return from the local strategy, it contains the user's email and password
    const token = await this.authService.login(req.user);
    return res.status(200).json(token);
  }
}
