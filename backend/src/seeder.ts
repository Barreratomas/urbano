/**
 * Script de ejecución de seeders.
 * Configura la conexión a la base de datos y ejecuta los seeders de usuarios y cursos.
 */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';

import { Content } from './content/content.entity';
import { Course } from './course/course.entity';
import { Enrollment } from './enrollments/enrollment.entity';
import { Favorite } from './favorites/favorite.entity';
import { CoursesSeeder } from './seeders/courses.seeder';
import { UsersSeeder } from './seeders/users.seeder';
import { User } from './user/user.entity';
import { Vote } from './votes/vote.entity';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST') || 'localhost',
        port: configService.get<number>('DATABASE_PORT') || 5432,
        username: configService.get<string>('DATABASE_USERNAME') || 'postgres',
        password: configService.get<string>('DATABASE_PASSWORD') || 'postgres',
        database: configService.get<string>('DATABASE_NAME') || 'nest-react-admin',
        entities: [User, Course, Content, Favorite, Enrollment, Vote],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Course, Content, Favorite, Enrollment, Vote]),
  ],
}).run([UsersSeeder, CoursesSeeder]);
