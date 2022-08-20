import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDTO } from './dto/create.dto';

@Controller('user')
export class UserController {
  @Post('sign-in')
  signIn(@Body() body: CreateAccountDTO) {
    return body;
  }
}
