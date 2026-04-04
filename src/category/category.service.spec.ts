import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { categoryService } from './category.service';
import { Category } from './category.entity';

describe('categoryService', () => {
  let service: categoryService;
  let repository: Repository<Category>;

  // 1. MOCK DEL REPOSITORIO
  const mockCategoryRepository = {
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
        categoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<categoryService>(categoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia las llamadas entre tests
  });

  // --- PRUEBA: CREATE ---
  describe('create', () => {
    it('debe crear y guardar una nueva categoría', async () => {
      const dto = { name: 'Tradicional' };
      const savedCategory = { id: 1, ...dto };

      mockCategoryRepository.create.mockReturnValue(dto);
      mockCategoryRepository.save.mockResolvedValue(savedCategory);

      const result = await service.create(dto as any);

      expect(result).toEqual(savedCategory);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(dto);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // --- PRUEBA: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar un arreglo de categorías', async () => {
      const categories = [{ id: 1, name: 'Blackwork' }];
      mockCategoryRepository.find.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(mockCategoryRepository.find).toHaveBeenCalled();
    });
  });

  // --- PRUEBA: FIND BY ID ---
  describe('findById', () => {
    it('debe retornar una categoría por su ID', async () => {
      const category = { id: 1, name: 'Realismo' };
      mockCategoryRepository.findOneBy.mockResolvedValue(category);

      const result = await service.findById(1);

      expect(result).toEqual(category);
      expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // --- PRUEBA: UPDATE ---
  describe('update', () => {
    it('debe actualizar una categoría y devolver el objeto actualizado', async () => {
      const id = 1;
      const dto = { name: 'Neo-Tradicional' };
      const updatedCategory = { id, ...dto };

      mockCategoryRepository.update.mockResolvedValue({ affected: 1 });
      mockCategoryRepository.findOneBy.mockResolvedValue(updatedCategory);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(updatedCategory);
      expect(mockCategoryRepository.update).toHaveBeenCalledWith(id, dto);
    });
  });

  // --- PRUEBAS: REMOVE ---
  describe('remove', () => {
    it('debe retornar el ID si la categoría fue eliminada (affected > 0)', async () => {
      mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debe retornar null si ninguna categoría fue afectada', async () => {
      mockCategoryRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toBeNull();
    });
  });
});