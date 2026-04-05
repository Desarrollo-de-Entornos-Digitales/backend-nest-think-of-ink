import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { postService } from './post.service';
import { Post } from './post.entity';

describe('postService', () => {
  let service: postService;

  // 1. MOCK DEL REPOSITORIO DE POSTS
  const mockPostRepository = {
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
        postService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<postService>(postService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBA: CREATE ---
  describe('create', () => {
    it('debe crear y guardar un nuevo post de tatuaje', async () => {
      const dto = { 
        title: 'Tatuaje Realista León', 
        description: 'Sesión de 6 horas', 
        imageUrl: 'http://imagen.com/tatto.jpg' 
      };
      const savedPost = { id: 1, ...dto };

      mockPostRepository.create.mockReturnValue(dto);
      mockPostRepository.save.mockResolvedValue(savedPost);

      const result = await service.create(dto as any);

      expect(result).toEqual(savedPost);
      expect(mockPostRepository.create).toHaveBeenCalledWith(dto);
      expect(mockPostRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // --- PRUEBA: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar todos los posts', async () => {
      const posts = [
        { id: 1, title: 'Old School' },
        { id: 2, title: 'Fine Line' }
      ];
      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.findAll();

      expect(result).toEqual(posts);
      expect(mockPostRepository.find).toHaveBeenCalled();
    });
  });

  // --- PRUEBA: FIND BY ID ---
  describe('findById', () => {
    it('debe retornar un post específico por ID', async () => {
      const post = { id: 1, title: 'Geometric' };
      mockPostRepository.findOneBy.mockResolvedValue(post);

      const result = await service.findById(1);

      expect(result).toEqual(post);
      expect(mockPostRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // --- PRUEBA: UPDATE ---
  describe('update', () => {
    it('debe actualizar el post y retornar la versión nueva', async () => {
      const id = 1;
      const dto = { title: 'Título Actualizado' };
      const updatedPost = { id, ...dto, description: 'Misma descripción' };

      mockPostRepository.update.mockResolvedValue({ affected: 1 });
      mockPostRepository.findOneBy.mockResolvedValue(updatedPost);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(updatedPost);
      expect(mockPostRepository.update).toHaveBeenCalledWith(id, dto);
      expect(mockPostRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  // --- PRUEBAS: REMOVE ---
  describe('remove', () => {
    it('debe retornar el ID del post eliminado', async () => {
      mockPostRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockPostRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debe retornar null si el post no existe para eliminar', async () => {
      mockPostRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toBeNull();
    });
  });
});