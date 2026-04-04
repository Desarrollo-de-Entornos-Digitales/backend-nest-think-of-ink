import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { commentService } from './comment.service';
import { Comment } from './comment.entity';

describe('commentService', () => {
  let service: commentService;

  // 1. MOCK DEL REPOSITORIO DE COMENTARIOS
  const mockCommentRepository = {
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
        commentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<commentService>(commentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBA: CREATE ---
  describe('create', () => {
    it('debe crear y guardar un nuevo comentario', async () => {
      const dto = { content: '¡Increíble tatuaje!', userId: 1, postId: 1 };
      const savedComment = { id: 1, ...dto };

      mockCommentRepository.create.mockReturnValue(dto);
      mockCommentRepository.save.mockResolvedValue(savedComment);

      const result = await service.create(dto as any);

      expect(result).toEqual(savedComment);
      expect(mockCommentRepository.create).toHaveBeenCalledWith(dto);
      expect(mockCommentRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // --- PRUEBA: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar un arreglo de comentarios', async () => {
      const comments = [{ id: 1, content: 'Genial' }];
      mockCommentRepository.find.mockResolvedValue(comments);

      const result = await service.findAll();

      expect(result).toEqual(comments);
      expect(mockCommentRepository.find).toHaveBeenCalled();
    });
  });

  // --- PRUEBA: FIND BY ID ---
  describe('findById', () => {
    it('debe retornar un comentario por su ID', async () => {
      const comment = { id: 1, content: 'Muy bueno' };
      mockCommentRepository.findOneBy.mockResolvedValue(comment);

      const result = await service.findById(1);

      expect(result).toEqual(comment);
      expect(mockCommentRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // --- PRUEBA: UPDATE ---
  describe('update', () => {
    it('debe actualizar un comentario y devolver el objeto actualizado', async () => {
      const id = 1;
      const dto = { content: 'Contenido editado' };
      const updatedComment = { id, ...dto };

      mockCommentRepository.update.mockResolvedValue({ affected: 1 });
      mockCommentRepository.findOneBy.mockResolvedValue(updatedComment);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(updatedComment);
      expect(mockCommentRepository.update).toHaveBeenCalledWith(id, dto);
      expect(mockCommentRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  // --- PRUEBAS: REMOVE ---
  describe('remove', () => {
    it('debe retornar el ID si el comentario fue eliminado', async () => {
      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockCommentRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debe retornar null si el comentario a eliminar no existe', async () => {
      mockCommentRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toBeNull();
    });
  });
});