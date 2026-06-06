import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';

import { CreateComment } from './dto/create-comment.dto';
import { Updatecomment } from './dto/update-comment.dto';

@Injectable()
export class commentService {
  private readonly logger = new Logger(commentService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(createComment: CreateComment, userId: number, postId: number) {
    if (!createComment.text || !createComment.text.trim()) {
      throw new BadRequestException('El contenido del comentario es obligatorio');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post ${postId} no encontrado`);
    }

    const data: any = {
      text: createComment.text.trim(),
      user: { id: userId },
      post: { id: postId },
    };

    try {
      const newComment = this.commentRepository.create(data);
      const saved = await this.commentRepository.save(newComment) as unknown as Comment;
      return await this.commentRepository.findOne({
        where: { id: saved.id },
        relations: ['user'],
      });
    } catch (error) {
      this.logger.error(`Error al crear comentario: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByPost(postId: number) {
    try {
      return await this.commentRepository.find({
        where: { post: { id: postId } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Error al obtener comentarios: ${error.message}`, error.stack);
      throw error;
    }
  }
  async update(id: number, updateComment: Updatecomment) {
    await this.commentRepository.update(id, updateComment);
    return this.commentRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.commentRepository.delete(id);
    if (result.affected) {
      return { id };
    }
    return null;
  }
  findById(id: number) {
    return this.commentRepository.findOneBy({ id });
  }
  findAll() {
    return this.commentRepository.find();
  }
}
