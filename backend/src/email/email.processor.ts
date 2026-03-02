import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';

/**
 * Consumidor (Worker) de la cola de Email.
 * Procesa las tareas de envío de correo de forma asíncrona.
 *
 */
@Processor('email_queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Procesa el envío de un correo de contacto.
   */
  @Process('send_contact_email')
  async handleSendContactEmail(job: Job<{ to: string; subject: string; text: string }>) {
    this.logger.log(`Procesando envío de email para: ${job.data.to}...`);

    try {
      await this.mailerService.sendMail({
        to: job.data.to,
        subject: job.data.subject,
        text: job.data.text,
        // se podría usar plantillas HTML
      });

      this.logger.log(`Email enviado con éxito a: ${job.data.to}`);
    } catch (error) {
      this.logger.error(`Error enviando email a ${job.data.to}: ${error.message}`);
      // Bull reintentará automáticamente si lanzamos una excepción
      throw error;
    }
  }
}
