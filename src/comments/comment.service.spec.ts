import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { commentService } from './comment.service';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';

describe('commentService', () => {
  let service: commentService;

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockPostRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        commentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
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
      const dto = { postId: 1, content: '¡Increíble tatuaje!' };
      const userId = 1;
      const savedComment = { id: 1, content: '¡Increíble tatuaje!', user: { id: 1 }, post: { id: 1 } };

      mockPostRepository.findOne.mockResolvedValue({ id: 1 });
      mockCommentRepository.create.mockReturnValue(dto);
      mockCommentRepository.save.mockResolvedValue(savedComment);
      mockCommentRepository.findOne.mockResolvedValue(savedComment);

      const result = await service.create(dto as any, userId);

      expect(result).toEqual(savedComment);
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

  // --- PRUEBAS: REMOVE ---
  describe('remove', () => {
    it('debe eliminar el comentario si el usuario es el dueño', async () => {
      mockCommentRepository.findOne.mockResolvedValue({ id: 1, user: { id: 1 } });
      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1, 1);

      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar error si no es el dueño', async () => {
      mockCommentRepository.findOne.mockResolvedValue({ id: 1, user: { id: 2 } });

      await expect(service.remove(1, 1)).rejects.toThrow();
    });
  });
});