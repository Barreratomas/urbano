import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContentModule } from '../content/content.module';
import { CourseController } from './course.controller';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { Favorite } from '../favorites/favorite.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Vote } from '../votes/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Favorite, Enrollment, Vote]),
    forwardRef(() => ContentModule),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
