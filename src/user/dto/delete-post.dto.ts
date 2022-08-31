import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export class DeletePostDto {
  @ApiProperty({ description: 'Post ID' })
  @IsNumber()
  @IsDefined()
  postId: number;
}
