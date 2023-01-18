import { Module } from '@nestjs/common';
import { ShortenerModule } from './shortener/shortener.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRoot(),
    ShortenerModule,
    HealthModule,
  ],
})
export class AppModule {}
