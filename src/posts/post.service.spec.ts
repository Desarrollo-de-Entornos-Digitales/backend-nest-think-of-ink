import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { PostLike } from '../likes/like.entity';
import { User } from '../users/user.entity';
import { Studio } from '../studio/studio.entity';
import { Category } from '../category/category.entity';
import { CategoryService } from '../category/category.service';

describe('PostService', () => {
  let service: PostService;

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPostLikeRepository = {
    find: jest.fn(),
  };

  const mockUserRepository = {
    find: jest.fn(),
  };

  const mockStudioRepository = {
    find: jest.fn(),
  };

  const mockCategoryRepository = {
    find: jest.fn(),
  };

  const mockCategoryService = {
    findByName: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
        {
          provide: getRepositoryToken(PostLike),
          useValue: mockPostLikeRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Studio),
          useValue: mockStudioRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    mockPostLikeRepository.find.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear y guardar un nuevo post', async () => {
      const dto = {
        title: 'Tatuaje Realista León',
        content: 'Sesión de 6 horas',
        imageUrl: 'http://imagen.com/tatto.jpg',
        location: '',
        postType: '',
      };
      const userId = 1;
      const savedPost = { id: 1, ...dto, user: { id: userId } };

      mockPostRepository.create.mockReturnValue(dto);
      mockPostRepository.save.mockResolvedValue(savedPost);

      const result = await service.create(dto as any, userId);

      expect(result).toEqual(savedPost);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los posts', async () => {
      const posts = [{ id: 1, title: 'Old School' }];
      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.findAll();

      expect(result).toMatchObject(posts as any);
      expect(mockPostRepository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('debe retornar un post específico por ID', async () => {
      const post = { id: 1, title: 'Geometric' };
      mockPostRepository.findOne.mockResolvedValue(post);

      const result = await service.findById(1);

      expect(result).toMatchObject(post);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'category', 'likes', 'comments'],
      });
    });
  });

  describe('update', () => {
    it('debe actualizar el post y retornar la versión nueva', async () => {
      const id = 1;
      const dto = { title: 'Título Actualizado' };
      const updatedPost = { id, ...dto, description: 'Misma descripción' };

      mockPostRepository.update.mockResolvedValue({ affected: 1 });
      mockPostRepository.findOne.mockResolvedValue(updatedPost);

      const result = await service.update(id, dto as any);

      expect(result).toMatchObject(updatedPost as any);
      expect(mockPostRepository.update).toHaveBeenCalledWith(id, {
        title: 'Título Actualizado',
      });
    });
  });

  describe('filterByPrice', () => {
    it('debe retornar posts dentro del rango de precio', async () => {
      const posts = [
        { id: 1, priceMin: 50000, priceMax: 100000 },
        { id: 2, priceMin: 100000, priceMax: 200000 },
      ];
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(posts),
      };
      mockPostRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockQueryBuilder);

      const result = await service.filterByPrice(50000, 200000, 'price_asc');
      expect(result).toMatchObject(posts as any);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('debe excluir posts sin precio', async () => {
      const posts: any[] = [];
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(posts),
      };
      mockPostRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockQueryBuilder);

      const result = await service.filterByPrice(0, 100000);
      expect(result).toMatchObject([]);
    });
  });

  describe('remove', () => {
    it('debe eliminar el post si el usuario es el dueño', async () => {
      const userId = 1;
      const post = { id: 1, user: { id: userId } };

      mockPostRepository.findOne.mockResolvedValue(post);
      mockPostRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1, userId);

      expect(result).toEqual({ message: 'Post eliminado con éxito', id: 1 });
    });

    it('debe lanzar error si el post no existe', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999, 1)).rejects.toThrow();
    });

    it('debe lanzar error si el usuario no es el dueño', async () => {
      const post = { id: 1, user: { id: 2 } };
      mockPostRepository.findOne.mockResolvedValue(post);

      await expect(service.remove(1, 1)).rejects.toThrow();
    });
  });
});
