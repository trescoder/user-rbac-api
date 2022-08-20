import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  password: string;
}
