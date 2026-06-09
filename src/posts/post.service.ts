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

const SECONDARY_IMAGE_MAP: Record<string, string> = {
  'Leopardo Realista': '/images/tattoos/tattoo-11.jpg',
  'Rostro Hiperrealista': '/images/tattoos/tattoo-12.jpg',
  'Corazón Anatómico': '/images/tattoos/tattoo-13.jpg',
  'Nombre en Script': '/images/tattoos/tattoo-14.jpg',
};

const ALL_DEMO_POST_USER_MAP: Record<string, string> = {
  'Dragón Japonés Blackwork': 'diegorodriguez',
  'Mandala Geométrico': 'pablogil',
  'Anime Sleeve Completo': 'sofiatoro',
  'Fénix Realista': 'luisrojas',
  'Lettering frase completa en espalda': 'mariagonzalez',
  'Acuarela Floral': 'dianacruz',
  'Retrato Marilyn Monroe': 'camilasanchez',
  'Diseño Floral Grande': 'juanramirez',
  'Geometría Cósmica': 'diegorodriguez',
  'Rosa Fine Line': 'mariagonzalez',
  'Plumas Fine Line': 'juanramirez',
  'Leopardo Realista': 'luisrojas',
  'Rostro Hiperrealista': 'camilasanchez',
  'Corazón Anatómico': 'dianacruz',
  'Nombre en Script': 'dianacruz',
};

const DEMO_USERNAMES = [
  'luisrojas',
  'dianacruz',
  'pablogil',
  'sofiatoro',
  'diegorodriguez',
  'mariagonzalez',
  'camilasanchez',
  'juanramirez',
];

const SEED_POSTS = [
  {
    content: 'Dragon negro estilo japonés cubriendo todo el brazo',
    imageUrl: '/images/tattoos/tattoo-1.jpg',
    title: 'Dragón Japonés Blackwork',
    priceMin: 80,
    priceMax: 150,
    userName: 'diegorodriguez',
    categoryName: 'Blackwork',
    studioName: 'Ink Master',
  },
  {
    content: 'Mandala geométrico en el centro de la espalda',
    imageUrl: '/images/tattoos/tattoo-2.jpg',
    title: 'Mandala Geométrico',
    priceMin: 60,
    priceMax: 100,
    userName: 'pablogil',
    categoryName: 'Geométrico',
    studioName: 'Black House Tattoo',
  },
  {
    content: 'Sleeve completo de anime con personajes y acción',
    imageUrl: '/images/tattoos/tattoo-3.jpg',
    title: 'Anime Sleeve Completo',
    priceMin: 120,
    priceMax: 200,
    userName: 'sofiatoro',
    categoryName: 'Neotradicional',
    studioName: 'Ink Starter Studio',
  },
  {
    content: 'Fénix realista renaciendo entre llamas en el antebrazo',
    imageUrl: '/images/tattoos/tattoo-4.jpg',
    title: 'Fénix Realista',
    priceMin: 100,
    priceMax: 180,
    userName: 'luisrojas',
    categoryName: 'Realismo',
    studioName: 'Real Ink Tattoo',
  },
  {
    content: 'Frase completa en lettering cursiva a lo largo de la espalda',
    imageUrl: '/images/tattoos/tattoo-5.jpg',
    title: 'Lettering frase completa en espalda',
    priceMin: 50,
    priceMax: 90,
    userName: 'mariagonzalez',
    categoryName: 'Fine Line',
    studioName: 'Fine Line Studio',
  },
  {
    content: 'Explosión de acuarela con colores pastel y flores',
    imageUrl: '/images/tattoos/tattoo-6.jpg',
    title: 'Acuarela Floral',
    priceMin: 50,
    priceMax: 90,
    userName: 'dianacruz',
    categoryName: 'Acuarela',
    studioName: 'Neo Art Studio',
  },
  {
    content: 'Retrato realista de Marilyn Monroe en escala de grises',
    imageUrl: '/images/tattoos/tattoo-7.jpg',
    title: 'Retrato Marilyn Monroe',
    priceMin: 120,
    priceMax: 200,
    userName: 'camilasanchez',
    categoryName: 'Realismo',
    studioName: 'Real Ink Tattoo',
  },
  {
    content: 'Diseño floral grande con rosas y girasoles en el muslo',
    imageUrl: '/images/tattoos/tattoo-8.jpg',
    title: 'Diseño Floral Grande',
    priceMin: 70,
    priceMax: 120,
    userName: 'juanramirez',
    categoryName: 'Neotradicional',
    studioName: 'Mini Tattoo Cali',
  },
  {
    content: 'Geometría cósmica con constelaciones y figuras geométricas',
    imageUrl: '/images/tattoos/tattoo-9.jpg',
    title: 'Geometría Cósmica',
    priceMin: 60,
    priceMax: 110,
    userName: 'diegorodriguez',
    categoryName: 'Geométrico',
    studioName: 'Black House Tattoo',
  },
  {
    content: 'Rosa minimalista en línea fina para antebrazo',
    imageUrl: '/images/tattoos/tattoo-10.jpg',
    title: 'Rosa Fine Line',
    priceMin: 40,
    priceMax: 70,
    userName: 'mariagonzalez',
    categoryName: 'Fine Line',
    studioName: 'Fine Line Studio',
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

    const oldAncla = await this.postRepository.findOne({
      where: { title: 'Ancla Tradicional' },
    });
    const animeSeed = SEED_POSTS.find((p) => p.title === 'Anime Sleeve Completo');
    if (oldAncla && animeSeed) {
      const newUser = findByUsername(animeSeed.userName);
      const newStudio = findByStudioName(animeSeed.studioName);
      const newCategory = findByCategoryName(animeSeed.categoryName);
      await this.postRepository.save({
        id: oldAncla.id,
        content: animeSeed.content,
        imageUrl: animeSeed.imageUrl,
        title: animeSeed.title,
        priceMin: animeSeed.priceMin,
        priceMax: animeSeed.priceMax,
        user: newUser,
        studio: newStudio,
        category: newCategory,
      });
    }

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
    if (oldAncla) existingTitles.add('Anime Sleeve Completo');
    const missingPosts = SEED_POSTS.filter(
      (p) => !existingTitles.has(p.title),
    );

    if (missingPosts.length > 0) {
      const posts = missingPosts.map((p) => ({
        ...p,
        user: findByUsername(p.userName),
        studio: findByStudioName(p.studioName),
        category: findByCategoryName(p.categoryName),
      }));
      const cleaned = posts.map(
        ({ userName, categoryName, studioName, ...rest }) => rest,
      );
      await this.postRepository.save(cleaned);
    }

    const secondaryTitles = Object.keys(SECONDARY_IMAGE_MAP);
    const secondaryPosts = await this.postRepository.find({
      where: { title: In(secondaryTitles) },
      relations: ['user'],
    });

    for (const post of secondaryPosts) {
      const expectedImage = SECONDARY_IMAGE_MAP[post.title];
      const expectedUsername = ALL_DEMO_POST_USER_MAP[post.title];
      if (
        expectedImage &&
        expectedUsername &&
        post.imageUrl !== expectedImage
      ) {
        await this.postRepository.update(post.id, { imageUrl: expectedImage });
      }
    }

    await this.postRepository.delete({ title: 'Lobo Realista' });

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

  async findByUsername(
    username: string,
    currentUserId?: number,
  ): Promise<Post[]> {
    const user = await this.userRepository.findOne({ where: { username } });
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
