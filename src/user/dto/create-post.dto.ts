import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDTO {
  @ApiProperty({ description: 'Post content.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
