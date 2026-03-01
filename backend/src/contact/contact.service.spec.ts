import { Test, TestingModule } from '@nestjs/testing';

import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactService],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should return success true', async () => {
      const result = await service.sendMessage('test@example.com', 'subject', 'message');
      expect(result).toEqual({ success: true });
    });
  });
});
