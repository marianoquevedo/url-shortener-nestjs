export class ShortUrlEntity {
  constructor(
    readonly id: number,
    readonly originalUrl: string,
    readonly code: string,
  ) {}
}
