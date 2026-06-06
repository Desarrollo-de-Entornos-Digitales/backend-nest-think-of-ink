import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudioService } from './studio.service';
import { Studio } from './studio.entity';

describe('StudioService', () => {
  let service: StudioService;

  const mockStudioRepository = {
    count: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudioService,
        {
          provide: getRepositoryToken(Studio),
          useValue: mockStudioRepository,
        },
      ],
    }).compile();

    service = module.get<StudioService>(StudioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los estudios', async () => {
      const studios = [{ id: 1, name: 'Ink Starter Studio' }];
      mockStudioRepository.find.mockResolvedValue(studios);
      const result = await service.findAll();
      expect(result).toEqual(studios);
    });
  });

  describe('findById', () => {
    it('debe retornar un estudio por ID', async () => {
      const studio = { id: 1, name: 'Test Studio' };
      mockStudioRepository.findOneBy.mockResolvedValue(studio);
      const result = await service.findById(1);
      expect(result).toEqual(studio);
    });

    it('debe lanzar error si no existe', async () => {
      mockStudioRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow();
    });
  });
});
