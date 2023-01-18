import { HasherService } from './hasher.service';
import { ShortenerService } from './shortener.service';
import { StorageService } from './storage.service';
import { UniqueIdService } from './uniqueId.service';

describe('ShortenerService', () => {
  let hasherService: HasherService;
  let uniqueIdService: UniqueIdService;
  let storageService: StorageService;
  let service: ShortenerService;

  // helper function to create mocked records
  const createFakeUrlRecord = function (
    id = 999,
    originalUrl = 'https://google.com',
    code = '999',
  ) {
    return {
      id,
      originalUrl,
      code,
    };
  };

  beforeEach(() => {
    hasherService = new HasherService();
    uniqueIdService = new UniqueIdService();
    storageService = new StorageService();
    service = new ShortenerService(
      hasherService,
      storageService,
      uniqueIdService,
    );
  });

  describe('encodeUrl', () => {
    it('should return existing record for same originalUrl', () => {
      const urlRecord = createFakeUrlRecord();

      jest
        .spyOn(storageService, 'getByUrl')
        .mockImplementation(() => urlRecord);

      const result = service.encodeUrl(urlRecord.originalUrl);

      expect(result).toEqual({
        originalUrl: urlRecord.originalUrl,
        code: urlRecord.code,
      });
    });

    it('should return a new record with the url code', () => {
      const mockedId = 5555;
      const originalUrl = 'https://hertz.auto';

      jest
        .spyOn(uniqueIdService, 'generate')
        .mockImplementation(() => mockedId);

      const result = service.encodeUrl(originalUrl);

      const expectedHash = hasherService.encode(mockedId.toString());
      expect(result).toEqual({
        originalUrl: originalUrl,
        code: expectedHash,
      });
    });
  });

  describe('decodeUrl', () => {
    it('should return null when code is not found in storage', () => {
      jest.spyOn(storageService, 'getById').mockImplementation(() => null);

      const result = service.decodeUrl('404');

      expect(result).toBeNull();
    });

    it('should return the record when it exists in storage', () => {
      const record = createFakeUrlRecord();
      jest.spyOn(storageService, 'getById').mockImplementation(() => record);

      const result = service.decodeUrl(record.code);

      expect(result).toEqual({
        originalUrl: record.originalUrl,
        code: record.code,
      });
    });
  });
});
