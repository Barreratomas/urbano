import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { ContactService } from './contact.service';

class ContactDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Subject of the message' })
  subject: string;

  @ApiProperty({ example: 'This is the message body' })
  message: string;
}

@Controller('contact')
@ApiTags('Contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async send(@Body() contactDto: ContactDto) {
    return this.contactService.sendMessage(
      contactDto.email,
      contactDto.subject,
      contactDto.message,
    );
  }
}
