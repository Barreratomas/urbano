/**
 * Controlador de Contacto.
 * Permite recibir mensajes de contacto de los usuarios.
 */
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ContactDto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller('contact')
@ApiTags('Contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Envía un mensaje de contacto.
   */
  @Post()
  async send(@Body() contactDto: ContactDto) {
    return this.contactService.sendMessage(
      contactDto.name,
      contactDto.email,
      contactDto.subject,
      contactDto.message,
    );
  }
}
