/**
 * Seeder de Cursos y Contenidos.
 * Genera datos de prueba iniciales para la base de datos.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { Content } from '../content/content.entity';
import { Course } from '../course/course.entity';

@Injectable()
export class CoursesSeeder implements Seeder {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  /**
   * Ejecuta el sembrado de datos.
   */
  async seed(): Promise<any> {
    // Generar 5 cursos aleatorios.
    const courses = DataFactory.createForClass(Course).generate(5) as any[];

    // Agregar un curso específico que abarque varios días para pruebas
    const testCourse = {
      name: 'Test Multi-Day Course',
      description: 'A course that spans from Feb 28 to March 1, 2026',
      startDate: new Date('2026-02-28T13:34:01.813Z'),
      endDate: new Date('2026-03-01T08:28:03.721Z'),
      dateCreated: new Date(),
      language: 'es',
    };
    courses.push(testCourse);

    const savedCourses = await this.courseRepository.save(courses);

    // Para cada curso, generar de 3 a 7 contenidos.
    for (const course of savedCourses) {
      const count = Math.floor(Math.random() * 5) + 3;
      const contents = DataFactory.createForClass(Content).generate(count);

      for (const content of contents) {
        content.course = course;
        // Asignar una imagen de marcador de posición para visualización
        content.imageUrl = 'https://via.placeholder.com/150';
      }

      await this.contentRepository.save(contents);
    }
  }

  /**
   * Elimina todos los datos generados por este seeder.
   */
  async drop(): Promise<any> {
    await this.contentRepository.delete({});
    return this.courseRepository.delete({});
  }
}
