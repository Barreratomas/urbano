/**
 * Servicio de Contacto.
 * Gestiona el envío de mensajes de consulta de los usuarios.
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Envía un mensaje de contacto (añadiéndolo a la cola de emails).
   */
  async sendMessage(name: string, email: string, subject: string, message: string) {
    try {
      await this.emailService.sendContactEmail(name, email, subject, message);
      return { success: true };
    } catch (error) {
      throw new HttpException('Error sending contact message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
