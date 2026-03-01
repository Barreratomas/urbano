import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Role } from './enums/role.enum';
import { User } from './user/user.entity';

async function createAdminOnFirstUse() {
  try {
    const admin = await User.findOne({ where: { username: 'admin' } });

    if (!admin) {
      Logger.log('Creating admin user on first use...', 'Bootstrap');

      const newUser = User.create({
        firstName: 'admin',
        lastName: 'admin',
        isActive: true,
        username: 'admin',
        role: Role.Admin,
        password: await bcrypt.hash('admin123', 10),
      });

      await newUser.save();

      Logger.log('Admin user created successfully.', 'Bootstrap');
    }
  } catch (error) {
    Logger.error('Failed to create admin user: ' + error.message, error.stack, 'Bootstrap');
  }
}

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isProduction ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  /*
   |--------------------------------------------------------------------------
   | Global Prefix
   |--------------------------------------------------------------------------
   */
  app.setGlobalPrefix('api');

  /*
   |--------------------------------------------------------------------------
   | CORS Configuration (Docker friendly)
   |--------------------------------------------------------------------------
   */
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
    optionsSuccessStatus: 200,
  });

  /*
   |--------------------------------------------------------------------------
   | Global Middlewares
   |--------------------------------------------------------------------------
   */
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /*
   |--------------------------------------------------------------------------
   | Global Filters
   |--------------------------------------------------------------------------
   */
  app.useGlobalFilters(new AllExceptionsFilter());

  /*
   |--------------------------------------------------------------------------
   | Static Files (Uploads)
   |--------------------------------------------------------------------------
   */
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  /*
   |--------------------------------------------------------------------------
   | Swagger Documentation
   |--------------------------------------------------------------------------
   */
  const config = new DocumentBuilder()
    .setTitle('Urbano Admin API')
    .setDescription('API Documentation for Urbano Admin Project')
    .setVersion('1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  /*
   |--------------------------------------------------------------------------
   | First Use Admin Seeder
   |--------------------------------------------------------------------------
   */
  await createAdminOnFirstUse();

  /*
   |--------------------------------------------------------------------------
   | Start Server
   |--------------------------------------------------------------------------
   */
  await app.listen(5000, '0.0.0.0');

  Logger.log('Backend listening on http://0.0.0.0:5000/api', 'Bootstrap');
}

bootstrap();
