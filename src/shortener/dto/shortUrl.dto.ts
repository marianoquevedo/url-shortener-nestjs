export class ShortUrlDto {
  constructor(readonly originalUrl: string, readonly code: string) {}
}
