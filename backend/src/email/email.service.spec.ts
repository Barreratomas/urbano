import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: getQueueToken('email_queue'),
          useValue: {
            add: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    queue = module.get<Queue>(getQueueToken('email_queue'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendContactEmail', () => {
    it('should add a job to the email queue', async () => {
      const name = 'Juan Pérez';
      const email = 'juan@example.com';
      const subject = 'Consulta';
      const message = 'Hola, necesito ayuda.';

      await service.sendContactEmail(name, email, subject, message);

      expect(queue.add).toHaveBeenCalledWith(
        'send_contact_email',
        {
          to: email,
          subject,
          text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
        },
        expect.any(Object),
      );
    });
  });
});
