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

  async seed(): Promise<any> {
    // Generate 5 random courses.
    const courses = DataFactory.createForClass(Course).generate(5) as any[];

    // Add a specific course that spans multiple days for testing
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

    // For each course, generate 3-7 contents.
    for (const course of savedCourses) {
      const count = Math.floor(Math.random() * 5) + 3;
      const contents = DataFactory.createForClass(Content).generate(count);

      for (const content of contents) {
        content.course = course;
        // assign a placeholder image so we see something after seeding
        content.imageUrl = 'https://via.placeholder.com/150';
      }

      await this.contentRepository.save(contents);
    }
  }

  async drop(): Promise<any> {
    await this.contentRepository.delete({});
    return this.courseRepository.delete({});
  }
}
