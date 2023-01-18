import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ShortenerController (e2e)', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);
    baseUrl = configService.get<string>('baseUrl');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /encode', () => {
    it('should return 400 when payload is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/encode/')
        .send({
          invalidFieldName: 'https://hertz.auto',
        });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when provided url is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/encode/')
        .send({
          url: 'hertz/test',
        });

      expect(response.statusCode).toBe(400);
    });

    it('encodes URL and returns 201', async () => {
      const payload = {
        url: 'https://hertz.auto',
      };

      const response = await request(app.getHttpServer())
        .post('/encode/')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        shorterUrl: `${baseUrl}/decode/64rg`,
      });
    });

    it('should return same response for same original URL', async () => {
      // arrange: set-up test payload
      const payload = {
        url: 'https://hertz.auto',
      };

      // act: call the endpoint twice with the same URL
      const firstResponse = await request(app.getHttpServer())
        .post('/encode/')
        .send(payload);

      const secondResponse = await request(app.getHttpServer())
        .post('/encode/')
        .send(payload);

      // assert: the responses are equal
      expect(firstResponse.statusCode).toBe(201);
      expect(secondResponse.statusCode).toBe(firstResponse.statusCode);
      expect(firstResponse.body).toMatchObject(secondResponse.body);
    });
  });

  describe('GET /decode', () => {
    it('returns 404 when code is not found in storage', () => {
      const code = '64rgtg';

      return request(app.getHttpServer()).get(`/decode/${code}`).expect(404);
    });

    it('returns 200 and original URL when found in storage', async () => {
      // arrange: encode and store URL
      const payload = {
        url: 'https://hertz.auto/get/',
      };
      const response = await request(app.getHttpServer())
        .post('/encode/')
        .send(payload);
      expect(response.statusCode).toBe(201);

      // get the shorterUrl and clean the baseUrl from it
      const shorterUrl: string = response.body.shorterUrl;
      const decodePath = shorterUrl.replace(baseUrl, '');

      // act: call the decode endpoint
      const decodeResponse = await request(app.getHttpServer()).get(decodePath);

      // assert: original URL must match the URL sent to /encode
      expect(decodeResponse.statusCode).toBe(200);
      expect(decodeResponse.body).toMatchObject({
        originalUrl: payload.url,
      });
    });
  });
});
