import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

/**
 * Servicio de Email (Productor).
 * Se encarga de añadir tareas de envío de correo a la cola Bull.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(@InjectQueue('email_queue') private readonly emailQueue: Queue) {}

  /**
   * Añade una tarea de envío de email a la cola.
   */
  async sendContactEmail(
    name: string,
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    try {
      await this.emailQueue.add(
        'send_contact_email',
        {
          to: email,
          subject,
          text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
        },
        {
          attempts: 3, // Reintentar hasta 3 veces si falla
          backoff: {
            type: 'exponential',
            delay: 5000, // 5 segundos de espera inicial entre reintentos
          },
          removeOnComplete: true, // Eliminar de la cola si se completa con éxito
        },
      );
      this.logger.log(`Tarea de email para ${email} añadida a la cola correctamente.`);
    } catch (error) {
      this.logger.error(`Error al añadir tarea de email a la cola: ${error.message}`);
      throw error;
    }
  }
}
