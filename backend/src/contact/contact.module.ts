import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [EmailModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
