import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';

import { EmailProcessor } from './email.processor';

describe('EmailProcessor', () => {
  let processor: EmailProcessor;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailProcessor,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    module.useLogger(false); // <-- AGREGA ESTA LÍNEA AQUÍ

    processor = module.get<EmailProcessor>(EmailProcessor);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('handleSendContactEmail', () => {
    it('should call mailerService.sendMail with correct data', async () => {
      const jobData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test message body',
      };

      const mockJob = {
        data: jobData,
      } as Job;

      await processor.handleSendContactEmail(mockJob);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: jobData.to,
        subject: jobData.subject,
        text: jobData.text,
      });
    });

    it('should throw error if mailerService fails', async () => {
      const error = new Error('SMTP Error');
      jest.spyOn(mailerService, 'sendMail').mockRejectedValueOnce(error);

      const mockJob = {
        data: { to: 'fail@example.com' },
      } as Job;

      await expect(processor.handleSendContactEmail(mockJob)).rejects.toThrow('SMTP Error');
    });
  });
});
