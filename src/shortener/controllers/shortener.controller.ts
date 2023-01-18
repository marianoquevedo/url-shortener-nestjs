import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Body,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EncodeUrlInput } from '../dto/encodeUrl.input';
import { ShortenerService } from '../providers/shortener.service';
import { EncodeUrlOutput } from '../dto/encodeUrl.output';
import { ConfigService } from '@nestjs/config';
import { DecodeUrlOutput } from '../dto/decodeUrl.output';

@Controller()
export class ShortenerController {
  private baseUrl: string;

  constructor(
    configService: ConfigService,
    private readonly shortenerService: ShortenerService,
  ) {
    this.baseUrl = configService.get<string>('baseUrl');
  }

  @Post('encode')
  @ApiOperation({ summary: 'Encode URL to a shorter one' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({
    status: 200,
    description: 'The encoded URL',
    type: EncodeUrlOutput,
  })
  encode(@Body() body: EncodeUrlInput): EncodeUrlOutput {
    const result = this.shortenerService.encodeUrl(body.url);
    return new EncodeUrlOutput(this.baseUrl, result.code);
  }

  @Get('decode/:code')
  @ApiOperation({ summary: 'Decode URL code to the original one' })
  @ApiResponse({ status: 404, description: 'Code not found' })
  @ApiResponse({
    status: 200,
    description: 'The original URL',
    type: DecodeUrlOutput,
  })
  decode(@Param('code') code: string): DecodeUrlOutput {
    const result = this.shortenerService.decodeUrl(code);
    if (!result) {
      throw new NotFoundException('Code not found');
    }
    return new DecodeUrlOutput(result.originalUrl);
  }
}
