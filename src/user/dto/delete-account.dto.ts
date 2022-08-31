import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDefined } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({ description: 'Account ID' })
  @IsNumber()
  @IsDefined()
  accountId: number;
}
