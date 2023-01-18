import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  const uniqueId = 99999999;
  const idCode = 'yhd52g';
  const originalUrl = 'https://hertz.auto';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should save a new record', () => {
    const saved = service.save(uniqueId, originalUrl, idCode);
    expect(saved).not.toBeNull();
  });

  it('should throw error if a record with same id exists', () => {
    service.save(uniqueId, originalUrl, idCode);

    expect(() => {
      service.save(uniqueId, 'https://google.com', idCode);
    }).toThrow();
  });

  describe('getById', () => {
    it('should return a record by id', () => {
      service.save(uniqueId, originalUrl, idCode);

      const record = service.getById(uniqueId);

      expect(record).not.toBeNull();
    });

    it('should return null if not found', () => {
      service.save(uniqueId, originalUrl, idCode);

      const record = service.getById(uniqueId + 1);

      expect(record).toBeNull();
    });
  });

  describe('getByUrl', () => {
    it('should return a record by URL', () => {
      service.save(uniqueId, originalUrl, idCode);

      const record = service.getByUrl(originalUrl);

      expect(record).not.toBeNull();
    });

    it('should return null if URL not found', () => {
      service.save(uniqueId, originalUrl, idCode);

      const record = service.getByUrl(`${originalUrl}/login`);

      expect(record).toBeNull();
    });
  });
});
