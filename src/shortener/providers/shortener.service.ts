import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UniqueIdService } from './uniqueId.service';
import { ShortUrlDto } from '../dto/shortUrl.dto';
import { HasherService } from './hasher.service';

@Injectable()
export class ShortenerService {
  constructor(
    private readonly hasherService: HasherService,
    private readonly storageService: StorageService,
    private readonly uniqueIdService: UniqueIdService,
  ) {}

  public encodeUrl(originalUrl: string): ShortUrlDto {
    // if we already encoded the URL, return what we have stored
    let urlRecord = this.storageService.getByUrl(originalUrl);
    if (urlRecord) {
      return new ShortUrlDto(urlRecord.originalUrl, urlRecord.code);
    }

    // generate a new id and encode it
    const newId = this.uniqueIdService.generate();
    const encodedId = this.hasherService.encode(newId.toString());

    // store the original URL with it's code
    urlRecord = this.storageService.save(newId, originalUrl, encodedId);
    return new ShortUrlDto(urlRecord.originalUrl, urlRecord.code);
  }

  public decodeUrl(code: string): ShortUrlDto | null {
    // convert from code back to unique id
    const id = parseInt(this.hasherService.decode(code), 10);

    const urlRecord = this.storageService.getById(id);
    if (urlRecord == null) {
      return null;
    }

    return new ShortUrlDto(urlRecord.originalUrl, urlRecord.code);
  }
}
