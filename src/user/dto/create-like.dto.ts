import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDTO {
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsBoolean()
  @IsNotEmpty()
  like: boolean;
}
