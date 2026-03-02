/**
 * Servicio de Contacto.
 * Gestiona el envío de mensajes de consulta de los usuarios.
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  constructor() {}

  /**
   * Envía un mensaje de contacto.
   */
  async sendMessage(email: string, subject: string, message: string) {
    try {
      console.log('enviar mensaje', { email, subject, message });
      return { success: true };
    } catch (error) {
      throw new HttpException('Error sending contact message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
