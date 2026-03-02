import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContentModule } from '../content/content.module';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Vote } from '../votes/vote.entity';
import { CourseController } from './course.controller';
import { Course } from './course.entity';
import { CourseService } from './course.service';

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
