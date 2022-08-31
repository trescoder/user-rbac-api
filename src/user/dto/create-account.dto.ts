import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAccountDTO {
  @ApiProperty({
    description: 'Username',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @ApiProperty({
    description: 'User email',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  password: string;
}
