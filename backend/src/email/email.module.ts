import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';

/**
 * Módulo de Email.
 * Configura la cola Bull para procesamiento asíncrono y el servicio Mailer para envío de correos.
 */
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email_queue',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const user = configService.get('MAIL_USER');
        const pass = configService.get('MAIL_PASS');

        return {
          transport: {
            host: configService.get('MAIL_HOST') || 'localhost',
            port: configService.get('MAIL_PORT') || 1025,
            ignoreTLS: true,
            secure: false,
            // añade la propiedad auth si existe un usuario configurado
            ...(user ? { auth: { user, pass } } : {}),
          },
          defaults: {
            from: configService.get('MAIL_FROM') || '"No Reply" <noreply@example.com>',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
