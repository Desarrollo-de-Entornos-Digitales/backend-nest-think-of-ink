import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './post.entity';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPost: CreatePost): Promise<Post> {
    const newPost = this.postRepository.create(createPost);
    return await this.postRepository.save(newPost);
  }

  async findMyPosts(userId: number): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['user'],
    });
  }

  async findById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post con ID ${id} no encontrado`);
    }
    return post;
  }

  async update(id: number, updatePost: UpdatePost): Promise<Post> {
    await this.postRepository.update(id, updatePost);
    return await this.findById(id);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se pudo eliminar: Post ${id} no existe`);
    }
    return { message: 'Post eliminado con éxito', id };
  }
}
