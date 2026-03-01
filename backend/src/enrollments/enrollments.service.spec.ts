import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Enrollment } from './enrollment.entity';
import { EnrollmentsService } from './enrollments.service';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enroll', () => {
    it('should throw if already enrolled', async () => {
      mockRepo.findOne.mockResolvedValue({ id: 'en1' });

      await expect(service.enroll('u1', 'c1')).rejects.toThrow(
        new HttpException('Already enrolled', HttpStatus.BAD_REQUEST),
      );
    });

    it('should create and save if not enrolled', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const en = { id: 'en2' };
      mockRepo.create.mockReturnValue(en);
      mockRepo.save.mockResolvedValue(en);

      const result = await service.enroll('u1', 'c1');

      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(en);
    });
  });

  describe('withdraw', () => {
    it('should call delete with correct where clause', async () => {
      await service.withdraw('u1', 'c1');
      expect(mockRepo.delete).toHaveBeenCalledWith({
        user: { id: 'u1' },
        course: { id: 'c1' },
      });
    });
  });

  describe('listByUser', () => {
    it('should return enrollments for user', async () => {
      const list = [{ id: 'e1' }, { id: 'e2' }];
      mockRepo.find.mockResolvedValue(list);

      const result = await service.listByUser('u1');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 'u1' } },
        relations: ['course'],
      });
      expect(result).toEqual(list);
    });
  });
});
