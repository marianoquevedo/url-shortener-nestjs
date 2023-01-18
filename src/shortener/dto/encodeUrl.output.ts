import { URL } from 'url';
import { ApiProperty } from '@nestjs/swagger';

export class EncodeUrlOutput {
  @ApiProperty({
    example: 'http://short.est/decode/GeAi9K',
    description: 'The shorter version of the provided URL',
  })
  public readonly shorterUrl: string;

  constructor(baseUrl: string, code: string) {
    this.shorterUrl = new URL(`/decode/${code}`, baseUrl).toString();
  }
}
