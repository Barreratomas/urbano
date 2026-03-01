import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

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
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toggle', () => {
    it('should delete existing favorite if found', async () => {
      const existing = { id: 'fav1' } as Favorite;
      mockRepo.findOne.mockResolvedValue(existing);

      const result = await service.toggle('u1', 'c1');

      expect(mockRepo.findOne).toHaveBeenCalled();
      expect(mockRepo.delete).toHaveBeenCalledWith('fav1');
      expect(result).toBeNull();
    });

    it('should create new favorite if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const newFav = { id: 'fav2' };
      mockRepo.create.mockReturnValue(newFav);
      mockRepo.save.mockResolvedValue(newFav);

      const result = await service.toggle('u1', 'c1');

      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(newFav);
    });
  });

  describe('listByUser', () => {
    it('should return list of favorites for user', async () => {
      const list = [{ id: 'f1' }, { id: 'f2' }];
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
