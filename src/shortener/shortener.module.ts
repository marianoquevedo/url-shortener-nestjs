import { Module } from '@nestjs/common';
import { HasherService } from './providers/hasher.service';
import { ShortenerController } from './controllers/shortener.controller';
import { ShortenerService } from './providers/shortener.service';
import { StorageService } from './providers/storage.service';
import { UniqueIdService } from './providers/uniqueId.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ShortenerController],
  providers: [HasherService, ShortenerService, StorageService, UniqueIdService],
})
export class ShortenerModule {}
