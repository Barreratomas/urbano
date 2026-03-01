import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Vote } from './vote.entity';
import { VotesService } from './votes.service';

describe('VotesService', () => {
  let service: VotesService;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('vote', () => {
    it('should update existing vote', async () => {
      const existing = { id: 'v1', rating: 3 } as Vote;
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation((v) => Promise.resolve(v));

      const result = await service.vote('u1', 'c1', 5);

      expect(mockRepo.findOne).toHaveBeenCalled();
      expect(existing.rating).toBe(5);
      expect(mockRepo.save).toHaveBeenCalledWith(existing);
      expect(result).toEqual(existing);
    });

    it('should create new vote', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const newVote = { id: 'v2' };
      mockRepo.create.mockReturnValue(newVote);
      mockRepo.save.mockResolvedValue(newVote);

      const result = await service.vote('u1', 'c1', 4);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(newVote);
    });
  });

  describe('averageRating', () => {
    it('should return average from query builder', async () => {
      mockRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getRawOne.mockResolvedValue({ avg: '4.5' });

      const result = await service.averageRating('c1');

      expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('vote');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('AVG(vote.rating)', 'avg');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('vote.courseId = :courseId', {
        courseId: 'c1',
      });
      expect(result).toBe(4.5);
    });

    it('should return 0 if no results', async () => {
      mockRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getRawOne.mockResolvedValue({ avg: null });

      const result = await service.averageRating('c1');
      expect(result).toBe(0);
    });
  });
});
