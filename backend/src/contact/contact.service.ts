import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  constructor() {}

  async sendMessage(email: string, subject: string, message: string) {
    try {
      // placeholder implementation until mailer package is installed
      console.log('send message', { email, subject, message });
      return { success: true };
    } catch (error) {
      throw new HttpException('Error sending contact message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
