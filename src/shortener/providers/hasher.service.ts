import { Injectable } from '@nestjs/common';
import * as base32 from 'base32';

@Injectable()
export class HasherService {
  public encode(id: string): string {
    return base32.encode(id);
  }

  public decode(hash: string): string {
    return base32.decode(hash);
  }
}
