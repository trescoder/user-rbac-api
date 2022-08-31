import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post ID',
  })
  @IsNumber()
  @IsDefined()
  postId: number;

  @ApiProperty({
    description: 'Post content.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
