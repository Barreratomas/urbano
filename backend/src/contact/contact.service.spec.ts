import { Test, TestingModule } from '@nestjs/testing';

import { EmailService } from '../email/email.service';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: EmailService,
          useValue: {
            sendContactEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should return success true', async () => {
      const result = await service.sendMessage(
        'test name',
        'test@example.com',
        'subject',
        'message',
      );
      expect(result).toEqual({ success: true });
      expect(emailService.sendContactEmail).toHaveBeenCalledWith(
        'test name',
        'test@example.com',
        'subject',
        'message',
      );
    });
  });
});
