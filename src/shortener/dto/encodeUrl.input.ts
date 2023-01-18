import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EncodeUrlInput {
  @ApiProperty({
    example: 'https://hertz.auto',
    description: 'The URL to be shorten/encoded',
  })
  @IsUrl()
  public url: string;
}
