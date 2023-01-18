import { Injectable } from '@nestjs/common';
import { ShortUrlEntity } from '../entities/shortUrl.entity';

@Injectable()
export class StorageService {
  private urlsById = new Map<number, ShortUrlEntity>();
  private idsByUrl = new Map<string, number>();

  public save(id: number, originalUrl: string, code: string) {
    // We should not overwrite, it means the id provided is not unique
    if (this.urlsById.has(id)) {
      throw new Error(
        `Id already exists. Id:${id} - originalUrl:${originalUrl}`,
      );
    }

    const record = new ShortUrlEntity(id, originalUrl, code);
    this.urlsById.set(record.id, record);
    this.idsByUrl.set(this.normalizeKey(originalUrl), record.id);

    return record;
  }

  public getById(id: number): ShortUrlEntity | null {
    return this.urlsById.get(id) || null;
  }

  public getByUrl(originalUrl: string): ShortUrlEntity | null {
    const id = this.idsByUrl.get(this.normalizeKey(originalUrl));
    if (id == null) {
      return null;
    }

    return this.urlsById.get(id) || null;
  }

  private normalizeKey(originalUrl: string) {
    return originalUrl.trim().toLocaleLowerCase();
  }
}
