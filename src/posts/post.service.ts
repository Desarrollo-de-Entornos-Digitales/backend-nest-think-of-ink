import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
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

const ALL_DEMO_POST_USER_MAP: Record<string, string> = {
  'Dragón rojo neo tradicional': 'diegorodriguez',
  'Geometría cósmica': 'mariagonzalez',
  'Mandala geométrico': 'pablogil',
  'Rostro hiperrealista femenino': 'luisrojas',
  'Neo tradicional rosa y gato': 'juanramirez',
  'Lettering frase completa en espalda': 'camilasanchez',
  'Ave fénix realista a color': 'sofiatoro',
  'Diseño anime blackwork': 'diegorodriguez',
  'Geometría ornamental en hombro': 'pablogil',
  'Rostro floral fine line': 'dianacruz',
  'Leopardo Realista': 'luisrojas',
  'Corazón Anatómico': 'dianacruz',
  'Reloj y brújula geométrica': 'diegorodriguez',
  'Astronauta minimalista': 'camilasanchez',
  'Rosa negra neo tradicional': 'diegorodriguez',
};

const SEED_POSTS = [
  {
    content: 'Dragón rojo estilo neo tradicional con sombras y detalles escamosos',
    imageUrl: '/images/tattoos/tattoo-1.jpg',
    title: 'Dragón rojo neo tradicional',
    priceMin: 80,
    priceMax: 150,
    userName: 'diegorodriguez',
    categoryName: 'Neotradicional',
    studioName: 'Ink Master',
  },
  {
    content: 'Geometría cósmica con constelaciones y figuras geométricas',
    imageUrl: '/images/tattoos/tattoo-2.jpg',
    title: 'Geometría cósmica',
    priceMin: 60,
    priceMax: 110,
    userName: 'mariagonzalez',
    categoryName: 'Geométrico',
    studioName: 'Fine Line Studio',
  },
  {
    content: 'Mandala geométrico detallado en el centro de la espalda',
    imageUrl: '/images/tattoos/tattoo-3.jpg',
    title: 'Mandala geométrico',
    priceMin: 60,
    priceMax: 100,
    userName: 'pablogil',
    categoryName: 'Geométrico',
    studioName: 'Black House Tattoo',
  },
  {
    content: 'Rostro femenino hiperrealista en escala de grises',
    imageUrl: '/images/tattoos/tattoo-4.jpg',
    title: 'Rostro hiperrealista femenino',
    priceMin: 120,
    priceMax: 200,
    userName: 'luisrojas',
    categoryName: 'Realismo',
    studioName: 'Real Ink Tattoo',
  },
  {
    content: 'Rosa neo tradicional acompañada de un gato estilizado',
    imageUrl: '/images/tattoos/tattoo-5.jpg',
    title: 'Neo tradicional rosa y gato',
    priceMin: 70,
    priceMax: 120,
    userName: 'juanramirez',
    categoryName: 'Neotradicional',
    studioName: 'Mini Tattoo Cali',
  },
  {
    content: 'Frase completa en lettering cursiva a lo largo de la espalda',
    imageUrl: '/images/tattoos/tattoo-6.jpg',
    title: 'Lettering frase completa en espalda',
    priceMin: 50,
    priceMax: 90,
    userName: 'camilasanchez',
    categoryName: 'Fine Line',
    studioName: 'Fine Line Studio',
  },
  {
    content: 'Ave fénix realista renaciendo entre llamas a todo color',
    imageUrl: '/images/tattoos/tattoo-7.jpg',
    title: 'Ave fénix realista a color',
    priceMin: 100,
    priceMax: 180,
    userName: 'sofiatoro',
    categoryName: 'Realismo',
    studioName: 'Neo Art Studio',
  },
  {
    content: 'Diseño anime en blackwork con personajes y acción',
    imageUrl: '/images/tattoos/tattoo-8.jpg',
    title: 'Diseño anime blackwork',
    priceMin: 80,
    priceMax: 150,
    userName: 'diegorodriguez',
    categoryName: 'Blackwork',
    studioName: 'Ink Starter Studio',
  },
  {
    content: 'Geometría ornamental detallada sobre el hombro',
    imageUrl: '/images/tattoos/tattoo-9.jpg',
    title: 'Geometría ornamental en hombro',
    priceMin: 60,
    priceMax: 100,
    userName: 'pablogil',
    categoryName: 'Geométrico',
    studioName: 'Black House Tattoo',
  },
  {
    content: 'Rostro femenino combinado con elementos florales en fine line',
    imageUrl: '/images/tattoos/tattoo-10.jpg',
    title: 'Rostro floral fine line',
    priceMin: 50,
    priceMax: 90,
    userName: 'dianacruz',
    categoryName: 'Fine Line',
    studioName: 'Fine Line Studio',
  },
  {
    content: 'Leopardo realista en brazo con detalles de pelaje',
    imageUrl: '/images/tattoos/tattoo-11.jpg',
    title: 'Leopardo Realista',
    priceMin: 90,
    priceMax: 160,
    userName: 'luisrojas',
    categoryName: 'Realismo',
    studioName: 'Real Ink Tattoo',
  },
  {
    content: 'Corazón anatómico realista en antebrazo',
    imageUrl: '/images/tattoos/tattoo-13.jpg',
    title: 'Corazón Anatómico',
    priceMin: 80,
    priceMax: 140,
    userName: 'dianacruz',
    categoryName: 'Realismo',
    studioName: 'Real Ink Tattoo',
  },
  {
    content: 'Reloj de bolsillo y brújula en estilo geométrico',
    imageUrl: '/images/tattoos/tattoo-15.jpg',
    title: 'Reloj y brújula geométrica',
    priceMin: 70,
    priceMax: 130,
    userName: 'diegorodriguez',
    categoryName: 'Geométrico',
    studioName: 'Ink Master',
  },
  {
    content: 'Astronauta flotando en estilo minimalista fine line',
    imageUrl: '/images/tattoos/tattoo-16.jpg',
    title: 'Astronauta minimalista',
    priceMin: 50,
    priceMax: 90,
    userName: 'camilasanchez',
    categoryName: 'Fine Line',
    studioName: 'Fine Line Studio',
  },
  {
    content: 'Rosa negra estilo neo tradicional con sombras marcadas',
    imageUrl: '/images/tattoos/tattoo-17.jpg',
    title: 'Rosa negra neo tradicional',
    priceMin: 70,
    priceMax: 130,
    userName: 'diegorodriguez',
    categoryName: 'Neotradicional',
    studioName: 'Ink Master',
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
    const users = await this.userRepository.find();
    const studios = await this.studioRepository.find();
    const categories = await this.categoryRepository.find();
    if (users.length === 0 || categories.length === 0) return;

    const findByUsername = (u: string) => users.find((x) => x.username === u);
    const findByStudioName = (s: string) => studios.find((x) => x.name === s);
    const findByCategoryName = (c: string) =>
      categories.find((x) => x.name === c);

    const demoPostTitles = SEED_POSTS.map((p) => p.title);
    const existingPosts = await this.postRepository.find({
      where: { title: In(demoPostTitles) },
      relations: ['user'],
    });

    for (const existing of existingPosts) {
      const seedData = SEED_POSTS.find((p) => p.title === existing.title);
      if (!seedData) continue;
      const newUser = findByUsername(seedData.userName);
      const updateData: any = {};
      let needsUpdate = false;
      if (seedData.imageUrl && existing.imageUrl !== seedData.imageUrl) {
        updateData.imageUrl = seedData.imageUrl;
        needsUpdate = true;
      }
      if (newUser && existing.user?.id !== newUser.id) {
        updateData.user = newUser;
        needsUpdate = true;
      }
      if (needsUpdate) {
        await this.postRepository.save({ id: existing.id, ...updateData });
      }
    }

    const existingTitles = new Set(existingPosts.map((p) => p.title));
    const missingPosts = SEED_POSTS.filter((p) => !existingTitles.has(p.title));

    const allPosts = await this.postRepository.find();
    const orphanPosts = allPosts.filter((p) => !existingTitles.has(p.title));

    let repurposed = 0;
    for (let i = 0; i < orphanPosts.length && i < missingPosts.length; i++) {
      const seedData = missingPosts[i];
      const orphan = orphanPosts[i];
      repurposed++;
      const category = findByCategoryName(seedData.categoryName);
      const studio = findByStudioName(seedData.studioName);
      const user = findByUsername(seedData.userName);
      await this.postRepository.save({
        id: orphan.id,
        title: seedData.title,
        content: seedData.content,
        imageUrl: seedData.imageUrl,
        priceMin: seedData.priceMin,
        priceMax: seedData.priceMax,
        user,
        category,
        studio,
      });
    }

    if (missingPosts.length > repurposed) {
      const remainingPosts = missingPosts.slice(repurposed);
      const freshPosts = remainingPosts.map((p) => ({
        ...p,
        user: findByUsername(p.userName),
        studio: findByStudioName(p.studioName),
        category: findByCategoryName(p.categoryName),
      }));
      const cleaned = freshPosts.map(
        ({ userName, categoryName, studioName, ...rest }) => rest,
      );
      await this.postRepository.save(cleaned);
    }

    if (orphanPosts.length > missingPosts.length) {
      const extraOrphans = orphanPosts.slice(missingPosts.length);
      await this.postRepository.delete(extraOrphans.map((p) => p.id));
    }

    const allDemoTitles = Object.keys(ALL_DEMO_POST_USER_MAP);
    const allDemoPosts = await this.postRepository.find({
      where: { title: In(allDemoTitles) },
      relations: ['user'],
    });

    for (const post of allDemoPosts) {
      const expectedUsername = ALL_DEMO_POST_USER_MAP[post.title];
      const expectedUser = findByUsername(expectedUsername);
      if (expectedUser && (!post.user || post.user.id !== expectedUser.id)) {
        await this.postRepository.save({ id: post.id, user: expectedUser });
      }
    }
  }

  private readonly defaultRelations = ['user', 'category', 'likes', 'comments'];

  private async attachLikedByUser(
    posts: Post[],
    userId?: number,
  ): Promise<Post[]> {
    if (!userId)
      return posts.map((p) => ({ ...p, likedByCurrentUser: false }) as any);
    const postIds = posts.map((p) => p.id);
    const likes = await this.postLikeRepository.find({
      where: { user: { id: userId }, post: { id: In(postIds) } },
      relations: ['post'],
    });
    const likedIds = new Set(likes.map((l) => l.post.id));
    return posts.map(
      (p) => ({ ...p, likedByCurrentUser: likedIds.has(p.id) }) as any,
    );
  }

  async create(
    createPost: CreatePost,
    userId: number,
    imageUrl?: string,
  ): Promise<Post> {
    const { category: categoryData, ...postData } = createPost;

    const newPost = this.postRepository.create({
      ...postData,
      imageUrl,
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

  private normalizeUsername(u: string): string {
    return u
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s_-]+/g, '')
      .toLowerCase();
  }

  async findByUsername(
    username: string,
    currentUserId?: number,
  ): Promise<Post[]> {
    const cleanUsername = this.normalizeUsername(username);
    let user = await this.userRepository.findOne({
      where: { username: cleanUsername },
    });
    if (!user) {
      const allUsers = await this.userRepository.find();
      const found = allUsers.find(
        (u) => this.normalizeUsername(u.username) === cleanUsername,
      );
      if (found) user = found;
    }
    if (!user) {
      throw new NotFoundException(`Usuario ${username} no encontrado`);
    }
    const posts = await this.postRepository.find({
      where: { user: { id: user.id } },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
    return this.attachLikedByUser(posts, currentUserId);
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
    return this.attachLikedByUser(
      posts.filter((p) => p.user),
      currentUserId,
    );
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
    return this.attachLikedByUser(
      posts.filter((p) => p.user),
      currentUserId,
    );
  }

  async findPopular(currentUserId?: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: this.defaultRelations,
    });
    const sorted = posts
      .filter((p) => p.user)
      .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
    return this.attachLikedByUser(sorted, currentUserId);
  }

  async findViral(currentUserId?: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: this.defaultRelations,
    });
    const sorted = posts
      .filter((p) => p.user)
      .sort((a, b) => (b.comments?.length ?? 0) - (a.comments?.length ?? 0));
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

  async remove(
    id: number,
    userId: number,
  ): Promise<{ message: string; id: number }> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post ${id} no encontrado`);
    }
    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta publicación',
      );
    }

    await this.postRepository.delete(id);
    return { message: 'Post eliminado con éxito', id };
  }
}
