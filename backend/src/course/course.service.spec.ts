import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Enrollment } from '../enrollments/enrollment.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Vote } from '../votes/vote.entity';
import { Course } from './course.entity';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;

  const mockCourseRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockVoteRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockFavoriteRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockEnrollmentRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepo,
        },
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepo,
        },
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockFavoriteRepo,
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentRepo,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCalendarData', () => {
    it('should correctly group courses by date and handle multi-day courses', async () => {
      const startDateStr = '2026-02-27';
      const endDateStr = '2026-03-02';

      const testCourse = {
        id: 'c1',
        name: 'Multi-Day Course',
        startDate: new Date('2026-02-28T13:34:00Z'),
        endDate: new Date('2026-03-01T08:00:00Z'),
        enrollments: [],
      };

      mockCourseRepo.find.mockResolvedValue([testCourse]);

      const result = await service.getCalendarData(startDateStr, endDateStr);

      // It should appear on 2026-02-28 and 2026-03-01
      const feb28 = result.find((r) => r.date === '2026-02-28');
      const mar01 = result.find((r) => r.date === '2026-03-01');
      const feb27 = result.find((r) => r.date === '2026-02-27');

      expect(feb28).toBeDefined();
      expect(feb28.courses).toContainEqual(expect.objectContaining({ name: 'Multi-Day Course' }));

      expect(mar01).toBeDefined();
      expect(mar01.courses).toContainEqual(expect.objectContaining({ name: 'Multi-Day Course' }));

      expect(feb27).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new course', async () => {
      const dto = { name: 'NestJS', description: 'Advanced' };
      const saved = { id: 'c1', ...dto, dateCreated: new Date() };
      mockCourseRepo.save.mockResolvedValue(saved);

      const result = await service.save(dto);
      expect(result).toEqual(saved);
      expect(mockCourseRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call find with correct filters', async () => {
      const query = { name: 'Nest', limit: 10, offset: 0 };
      mockCourseRepo.find.mockResolvedValue([]);

      await service.findAll(query as any);
      expect(mockCourseRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 0,
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return course if found and populate enrollment status', async () => {
      const course = {
        id: 'c1',
        enrollments: [{ user: { id: 'u1' } }],
        favorites: [],
      };
      mockCourseRepo.findOne.mockResolvedValue(course);

      const result = await service.findById('c1', 'u1');
      expect(result.id).toBe('c1');
      expect((result as any).isEnrolled).toBe(true);
      expect((result as any).isFavorite).toBe(false);
    });

    it('should return course if found', async () => {
      const course = { id: 'c1' };
      mockCourseRepo.findOne.mockResolvedValue(course);

      const result = await service.findById('c1');
      expect(result).toEqual(course);
    });

    it('should throw if not found', async () => {
      mockCourseRepo.findOne.mockResolvedValue(null);
      await expect(service.findById('c1')).rejects.toThrow(HttpException);
    });
  });

  describe('getAverageRating', () => {
    it('should return 0 if no votes', async () => {
      mockVoteRepo.find.mockResolvedValue([]);
      const result = await service.getAverageRating('c1');
      expect(result).toBe(0);
    });

    it('should return average of ratings', async () => {
      mockVoteRepo.find.mockResolvedValue([{ rating: 4 }, { rating: 5 }]);
      const result = await service.getAverageRating('c1');
      expect(result).toBe(4.5);
    });
  });
});
