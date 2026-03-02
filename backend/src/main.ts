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

/**
 * Crea un usuario administrador por defecto si no existe en el sistema.
 */
async function createAdminOnFirstUse() {
  try {
    const admin = await User.findOne({ where: { username: 'admin' } });

    if (!admin) {
      Logger.log('Creando usuario administrador por primera vez...', 'Bootstrap');

      const newUser = User.create({
        firstName: 'admin',
        lastName: 'admin',
        isActive: true,
        username: 'admin',
        role: Role.Admin,
        password: await bcrypt.hash('admin123', 10),
      });

      await newUser.save();

      Logger.log('Usuario administrador creado correctamente.', 'Bootstrap');
    }
  } catch (error) {
    Logger.error(
      'Error al crear el usuario administrador: ' + error.message,
      error.stack,
      'Bootstrap',
    );
  }
}

/**
 * Función de arranque del servidor.
 */
async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isProduction ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  /*
   |--------------------------------------------------------------------------
   | Prefijo Global
   |--------------------------------------------------------------------------
   */
  app.setGlobalPrefix('api');

  /*
   |--------------------------------------------------------------------------
   | Configuración de CORS
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
   | Middlewares Globales
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
   | Filtros Globales
   |--------------------------------------------------------------------------
   */
  app.useGlobalFilters(new AllExceptionsFilter());

  /*
   |--------------------------------------------------------------------------
   | Archivos Estáticos (Cargas)
   |--------------------------------------------------------------------------
   */
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  /*
   |--------------------------------------------------------------------------
   | Documentación Swagger
   |--------------------------------------------------------------------------
   */
  const config = new DocumentBuilder()
    .setTitle('Urbano Admin API')
    .setDescription('Documentación de la API para el proyecto Urbano Admin')
    .setVersion('1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  /*
   |--------------------------------------------------------------------------
   | Seeder de Administrador Inicial
   |--------------------------------------------------------------------------
   */
  await createAdminOnFirstUse();

  /*
   |--------------------------------------------------------------------------
   | Inicio del Servidor
   |--------------------------------------------------------------------------
   */
  await app.listen(5000, '0.0.0.0');

  Logger.log('Backend escuchando en http://0.0.0.0:5000/api', 'Bootstrap');
}

bootstrap();
