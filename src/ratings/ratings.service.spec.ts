import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ratingService } from './ratings.service';
import { Rating } from './rating.entity';

describe('ratingService', () => {
  let service: ratingService;

  // 1. MOCK DEL REPOSITORIO DE RATINGS (Puntuaciones)
  const mockRatingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ratingService,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRatingRepository,
        },
      ],
    }).compile();

    service = module.get<ratingService>(ratingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBA: CREATE ---
  describe('create', () => {
    it('debe registrar una nueva puntuación', async () => {
      const dto = { score: 5, comment: 'Excelente trabajo', postId: 1, userId: 2 };
      const savedRating = { id: 1, ...dto };

      mockRatingRepository.create.mockReturnValue(dto);
      mockRatingRepository.save.mockResolvedValue(savedRating);

      const result = await service.create(dto as any);

      expect(result).toEqual(savedRating);
      expect(mockRatingRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRatingRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // --- PRUEBA: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar todas las puntuaciones', async () => {
      const ratings = [
        { id: 1, score: 5 },
        { id: 2, score: 4 }
      ];
      mockRatingRepository.find.mockResolvedValue(ratings);

      const result = await service.findAll();

      expect(result).toEqual(ratings);
      expect(mockRatingRepository.find).toHaveBeenCalled();
    });
  });

  // --- PRUEBA: FIND BY ID ---
  describe('findById', () => {
    it('debe retornar una puntuación específica por ID', async () => {
      const rating = { id: 1, score: 5 };
      mockRatingRepository.findOneBy.mockResolvedValue(rating);

      const result = await service.findById(1);

      expect(result).toEqual(rating);
      expect(mockRatingRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // --- PRUEBA: UPDATE ---
  describe('update', () => {
    it('debe actualizar la puntuación y retornar el objeto actualizado', async () => {
      const id = 1;
      const dto = { score: 4 };
      const updatedRating = { id, score: 4, comment: 'Editado' };

      mockRatingRepository.update.mockResolvedValue({ affected: 1 });
      mockRatingRepository.findOneBy.mockResolvedValue(updatedRating);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(updatedRating);
      expect(mockRatingRepository.update).toHaveBeenCalledWith(id, dto);
      expect(mockRatingRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  // --- PRUEBAS: REMOVE ---
  describe('remove', () => {
    it('debe retornar el ID si la puntuación fue eliminada', async () => {
      mockRatingRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockRatingRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debe retornar null si la puntuación a eliminar no existe', async () => {
      mockRatingRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toBeNull();
    });
  });
});