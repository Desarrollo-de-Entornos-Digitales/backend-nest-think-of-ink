import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './post.entity';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly categoryService: CategoryService,
  ) {}

  private readonly defaultRelations = ['user', 'category', 'likes', 'comments'];

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

  async findMyPosts(userId: number): Promise<Post[]> {
    return await this.postRepository.find({
      where: { user: { id: userId } },
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(
    sort?: string,
    category?: string,
    userId?: number,
  ): Promise<Post[]> {
    const where: any = {};
    if (category) where.category = { name: category };
    if (userId) where.user = { id: userId };

    return await this.postRepository.find({
      where,
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: this.defaultRelations,
    });

    if (!post) {
      throw new NotFoundException(`Post con ID ${id} no encontrado`);
    }
    return post;
  }

  async findRecent(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: this.defaultRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findPopular(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: this.defaultRelations,
    });
    return posts.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
  }

  async findViral(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: this.defaultRelations,
    });
    return posts.sort((a, b) => (b.comments?.length ?? 0) - (a.comments?.length ?? 0));
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
