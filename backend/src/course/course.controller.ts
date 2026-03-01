import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Express } from 'express';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateContentDto, UpdateContentDto } from '../content/content.dto';
import { Content } from '../content/content.entity';
import { ContentQuery } from '../content/content.query';
import { ContentService } from '../content/content.service';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { Role } from '../enums/role.enum';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { CourseService } from './course.service';

@Controller('courses')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly contentService: ContentService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Editor)
  async save(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseService.save(createCourseDto);
  }

  @Get()
  async findAll(
    @Query() courseQuery: CourseQuery,
    @User('userId') userId?: string,
  ): Promise<Course[]> {
    return await this.courseService.findAll(courseQuery, userId);
  }

  @Get('/calendar')
  async calendar(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @User('userId') userId?: string,
  ): Promise<Array<{ date: string; courses: any[] }>> {
    if (!start || !end) {
      // default to current month
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    }
    return await this.courseService.getCalendarData(start, end, userId);
  }

  @Get('/favorites')
  async myFavorites(@User('userId') userId: string): Promise<Course[]> {
    return await this.courseService.myFavorites(userId);
  }

  @Get('/enrolled')
  async myEnrollments(@User('userId') userId: string): Promise<Course[]> {
    return await this.courseService.myEnrollments(userId);
  }

  @Get('/ranking')
  async ranking(): Promise<Course[]> {
    return await this.courseService.getRanking();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @User('userId') userId?: string): Promise<Course> {
    return await this.courseService.findById(id, userId);
  }

  @Post('/:id/favorite')
  async toggleFavorite(@Param('id') id: string, @User('userId') userId: string): Promise<void> {
    await this.courseService.toggleFavorite(userId, id);
  }

  @Delete('/:id/favorite')
  async unfavorite(@Param('id') id: string, @User('userId') userId: string): Promise<void> {
    await this.courseService.toggleFavorite(userId, id);
  }

  @Post('/:id/enroll')
  async enroll(@Param('id') id: string, @User('userId') userId: string): Promise<void> {
    await this.courseService.enroll(userId, id);
  }

  @Delete('/:id/enroll')
  async unenroll(@Param('id') id: string, @User('userId') userId: string): Promise<void> {
    await this.courseService.withdraw(userId, id);
  }

  @Post('/:id/vote')
  async vote(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body('value') value: number,
  ): Promise<void> {
    await this.courseService.vote(userId, id, value);
  }

  @Get('/:id/average-rating')
  async averageRating(@Param('id') id: string): Promise<number> {
    return await this.courseService.getAverageRating(id);
  }

  @Put('/:id')
  @Roles(Role.Admin, Role.Editor)
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Course> {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.courseService.delete(id);
  }

  @Post('/:id/contents')
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  async saveContent(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createContentDto: CreateContentDto,
  ): Promise<Content> {
    if (file) {
      // store relative URL for client
      createContentDto.imageUrl = `/uploads/${file.filename}`;
    }
    return await this.contentService.save(id, createContentDto);
  }

  @Get('/:id/contents')
  async findAllContentsByCourseId(
    @Param('id') id: string,
    @Query() contentQuery: ContentQuery,
  ): Promise<Content[]> {
    return await this.contentService.findAllByCourseId(id, contentQuery);
  }

  @Put('/:id/contents/:contentId')
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  async updateContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    if (file) {
      updateContentDto.imageUrl = `/uploads/${file.filename}`;
    }
    return await this.contentService.update(id, contentId, updateContentDto);
  }

  @Delete('/:id/contents/:contentId')
  @Roles(Role.Admin)
  async deleteContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
  ): Promise<string> {
    return await this.contentService.delete(id, contentId);
  }
}
