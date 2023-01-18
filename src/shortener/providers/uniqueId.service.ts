import { Injectable } from '@nestjs/common';

@Injectable()
export class UniqueIdService {
  // start at 10 to generate a 4 chars length code
  private sequence = 10;

  public generate(): number {
    return ++this.sequence;
  }
}
