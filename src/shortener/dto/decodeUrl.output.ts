import { ApiProperty } from '@nestjs/swagger';

export class DecodeUrlOutput {
  @ApiProperty({
    example: 'https://hertz.auto',
    description: 'The original URL provided',
  })
  public readonly originalUrl: string;

  constructor(originalUrl: string) {
    this.originalUrl = originalUrl;
  }
}
