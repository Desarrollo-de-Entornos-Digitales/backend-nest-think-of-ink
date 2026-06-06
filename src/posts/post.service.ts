import { Injectable, OnModuleInit, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Post } from './post.entity';
import { PostLike } from '../likes/like.entity';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { CategoryService } from '../category/category.service';
import { User } from '../users/user.entity';
import { Studio } from '../studio/studio.entity';
import { Category } from '../category/category.entity';

const SEED_POSTS = [
  {
    content: 'Dragon negro estilo japonés cubriendo todo el brazo',
    imageUrl: '/images/posts/dragon-blackwork.jpg',
    title: 'Dragón Japonés Blackwork',
    priceMin: 80,
    priceMax: 150,
    userName: 'luisrojas',
    categoryName: 'Blackwork',
    studioName: 'Ink Master',
  },
  {
    content: 'Rosa minimalista en línea fina para antebrazo',
    imageUrl: '/images/posts/rosa-fine-line.jpg',
    title: 'Rosa Fine Line',
    priceMin: 40,
    priceMax: 70,
    userName: 'dianacruz',
    categoryName: 'Fine Line',
    studioName: 'Fine Line Studio',
  },
  {
    content: 'Retrato realista de Marilyn Monroe en escala de grises',
    imageUrl: '/images/posts/marilyn-realismo.jpg',
    title: 'Retrato Marilyn Monroe',
    priceMin: 120,
    priceMax: 200,
    userName: 'pablogil',
    categoryName: 'Realismo',
    studioName: 'Real Ink Tattoo',
  },
  {
    content: 'Mandala geométrico en el centro de la espalda',
    imageUrl: '/images/posts/mandala-geometrico.jpg',
    title: 'Mandala Geométrico',
    priceMin: 60,
    priceMax: 100,
    userName: 'luisrojas',
    categoryName: 'Geométrico',
    studioName: 'Black House Tattoo',
  },
  {
    content: 'Explosión de acuarela con colores pastel y flores',
    imageUrl: '/images/posts/acuarela-floral.jpg',
    title: 'Acuarela Floral',
    priceMin: 50,
    priceMax: 90,
    userName: 'sofiatoro',
    categoryName: 'Acuarela',
    studioName: 'Neo Art Studio',
  },
  {
    content: 'Ancla tradicional old school con detalles neotradicionales',
    imageUrl: '/images/posts/ancla-tradicional.jpg',
    title: 'Ancla Tradicional',
    priceMin: 30,
    priceMax: 60,
    userName: 'dianacruz',
    categoryName: 'Neotradicional',
    studioName: 'Mini Tattoo Cali',
  },
  {
    content: 'Lobo siberiano realista en el muslo',
    imageUrl: '/images/posts/lobo-realismo.jpg',
    title: 'Lobo Realista',
    priceMin: 90,
    priceMax: 160,
    userName: 'pablogil',
    categoryName: 'Realismo',
    studioName: 'Real Ink Tattoo',
  },
  {
    content: 'Plumas finas y delicadas en línea fina',
    imageUrl: '/images/posts/plumas-fine-line.jpg',
    title: 'Plumas Fine Line',
    priceMin: 35,
    priceMax: 65,
    userName: 'sofiatoro',
    categoryName: 'Fine Line',
    studioName: 'Ink Starter Studio',
  },
];

@Injectable()
export class PostService implements OnModuleInit {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryService: CategoryService,
  ) {}

  async onModuleInit() {
    const count = await this.postRepository.count();
    if (count > 0) return;
    const users = await this.userRepository.find();
    const studios = await this.studioRepository.find();
    const categories = await this.categoryRepository.find();
    if (users.length === 0 || categories.length === 0) return;
    const posts = SEED_POSTS.map((p) => ({
      ...p,
      user: users.find((u) => u.username === p.userName),
      studio: studios.find((s) => s.name === p.studioName),
      category: categories.find((c) => c.name === p.categoryName),
    }));
    const cleaned = posts.map(({ userName, categoryName, studioName, ...rest }) => rest);
    await this.postRepository.save(cleaned);
  }

  private readonly defaultRelations = ['user', 'category', 'likes', 'comments'];

  private async attachLikedByUser(posts: Post[], userId?: number): Promise<Post[]> {
    if (!userId) return posts.map(p => ({ ...p, likedByCurrentUser: false } as any));
    const postIds = posts.map(p => p.id);
    const likes = await this.postLikeRepository.find({
      where: { user: { id: userId }, post: { id: In(postIds) } },
      relations: ['post'],
    });
    const likedIds = new Set(likes.map(l => l.post.id));
    return posts.map(p => ({ ...p, likedByCurrentUser: likedIds.has(p.id) } as any));
  }

  async create(createPost: CreatePost, userId: number): Promise<Post> {
    const { category: categoryData, ...postData } = createPost;

    const newPost = this.postRepository.create({
      ...postData,
      user: { id: userId },
    });

    if (categoryData?.name) {
      let category = await this.categoryService.findByName(categoryData.name);
      if (!category) {
        category = await this.categoryService.create({
          name: categoryData.name,
          description: '',
        });
      }
      newPost.category = category;
    }

    return await this.postRepository.save(newPost);
  }

  async findMyPosts(userId: number, currentUserId?: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      where: { user: { id: userId } },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return this.attachLikedByUser(posts, currentUserId || userId);
  }

  async findByStudio(studioId: number): Promise<Post[]> {
    return await this.postRepository.find({
      where: { studio: { id: studioId } },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(
    sort?: string,
    category?: string,
    filterUserId?: number,
    currentUserId?: number,
  ): Promise<Post[]> {
    const where: any = {};
    if (category) where.category = { name: category };
    if (filterUserId) where.user = { id: filterUserId };

    const posts = await this.postRepository.find({
      where,
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return this.attachLikedByUser(posts, currentUserId);
  }

  async findById(id: number, currentUserId?: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: this.defaultRelations,
    });

    if (!post) {
      throw new NotFoundException(`Post con ID ${id} no encontrado`);
    }
    const enriched = await this.attachLikedByUser([post], currentUserId);
    return enriched[0];
  }

  async findRecent(currentUserId?: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return this.attachLikedByUser(posts, currentUserId);
  }

  async findPopular(currentUserId?: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: this.defaultRelations,
    });
    const sorted = posts.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
    return this.attachLikedByUser(sorted, currentUserId);
  }

  async findViral(currentUserId?: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: this.defaultRelations,
    });
    const sorted = posts.sort((a, b) => (b.comments?.length ?? 0) - (a.comments?.length ?? 0));
    return this.attachLikedByUser(sorted, currentUserId);
  }

  async update(id: number, updatePost: UpdatePost): Promise<Post> {
    const { category: categoryData, ...postData } = updatePost;
    const updatePayload: any = { ...postData };

    if (categoryData?.name) {
      let category = await this.categoryService.findByName(categoryData.name);
      if (!category) {
        category = await this.categoryService.create({
          name: categoryData.name,
          description: '',
        });
      }
      updatePayload.category = { id: category.id };
    }

    await this.postRepository.update(id, updatePayload);
    return await this.findById(id);
  }

  async filterByPrice(
    minPrice: number,
    maxPrice: number,
    sort?: string,
    currentUserId?: number,
  ): Promise<Post[]> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.priceMin IS NOT NULL')
      .andWhere('post.priceMax IS NOT NULL')
      .andWhere('post.priceMin >= :minPrice', { minPrice })
      .andWhere('post.priceMax <= :maxPrice', { maxPrice });

    if (sort === 'price_asc') {
      query.orderBy('post.priceMin', 'ASC');
    } else if (sort === 'price_desc') {
      query.orderBy('post.priceMin', 'DESC');
    } else {
      query.orderBy('post.createdAt', 'DESC');
    }

    const posts = await query.getMany();
    return this.attachLikedByUser(posts, currentUserId);
  }

  async remove(id: number, userId: number): Promise<{ message: string; id: number }> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post ${id} no encontrado`);
    }
    if (post.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
    }

    await this.postRepository.delete(id);
    return { message: 'Post eliminado con éxito', id };
  }
}
