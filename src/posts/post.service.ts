import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './post.entity';

import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';

@Injectable()
export class postService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(createPost: CreatePost) {
    const newPost = this.postRepository.create({
      ...createPost,
    });

    return this.postRepository.save(newPost);
  }
  async update(id: number, updatePost: UpdatePost) {
    await this.postRepository.update(id, updatePost);
    return this.postRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.postRepository.delete(id);
    if (result.affected) {
      return { id };
    }
    return null;
  }
  findById(id: number) {
    return this.postRepository.findOneBy({ id });
  }
  findAll() {
    return this.postRepository.find();
  }
}
