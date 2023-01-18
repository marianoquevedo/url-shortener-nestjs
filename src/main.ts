import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // set-up default validation
  app.useGlobalPipes(new ValidationPipe());

  // swagger docs config
  const config = new DocumentBuilder()
    .setTitle('ShortLink API')
    .setDescription('A simple API to shorten URLs')
    .setVersion('1.0')
    .addServer(configService.get<string>('baseUrl'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // use pino for logging
  app.useLogger(app.get(Logger));

  // start server
  await app.listen(configService.get<number>('port'));
}
bootstrap();
