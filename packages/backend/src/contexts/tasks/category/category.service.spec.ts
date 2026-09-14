import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './application/category.service';
import { CategoryRepository } from './domain/category.repository';
import { NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<CategoryRepository>;

  const mockCategory = {
    id: '1',
    name: 'Trabajo',
    color: '#FF5733',
    userId: 'user-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            findAll: jest.fn(),
            getOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deleteItem: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all categories for a user', async () => {
      repository.findAll.mockResolvedValue([mockCategory]);

      const result = await service.findAll('user-1');
      expect(result).toEqual([mockCategory]);
      expect(repository.findAll).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getOne', () => {
    it('returns a category by id', async () => {
      repository.getOne.mockResolvedValue(mockCategory);

      const result = await service.getOne('1');
      expect(result).toEqual(mockCategory);
      expect(repository.getOne).toHaveBeenCalledWith('1');
    });

    it('throws NotFoundException when category not found', async () => {
      repository.getOne.mockResolvedValue(null);

      await expect(service.getOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a category', async () => {
      repository.create.mockResolvedValue(mockCategory);

      const result = await service.create('user-1', {
        name: 'Trabajo',
        color: '#FF5733',
      });

      expect(result).toEqual(mockCategory);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Trabajo',
        color: '#FF5733',
        userId: 'user-1',
      });
    });
  });

  describe('update', () => {
    it('updates a category', async () => {
      const updated = { ...mockCategory, name: 'Personal' };
      repository.getOne.mockResolvedValue(mockCategory);
      repository.update.mockResolvedValue(updated);

      const result = await service.update('1', { name: 'Personal' });
      expect(result).toEqual(updated);
      expect(repository.update).toHaveBeenCalledWith('1', { name: 'Personal' });
    });

    it('throws NotFoundException when category not found', async () => {
      repository.getOne.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Personal' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteItem', () => {
    it('deletes a category', async () => {
      repository.getOne.mockResolvedValue(mockCategory);
      repository.deleteItem.mockResolvedValue(undefined);

      await service.deleteItem('1');
      expect(repository.deleteItem).toHaveBeenCalledWith('1');
    });

    it('throws NotFoundException when category not found', async () => {
      repository.getOne.mockResolvedValue(null);

      await expect(service.deleteItem('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
