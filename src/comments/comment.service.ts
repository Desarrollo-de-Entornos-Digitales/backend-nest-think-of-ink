import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';

import { CreateComment } from './dto/create-comment.dto';

@Injectable()
export class commentService {
  private readonly logger = new Logger(commentService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createComment: CreateComment, userId: number) {
    if (!createComment.content || !createComment.content.trim()) {
      throw new BadRequestException('El contenido del comentario es obligatorio');
    }

    const post = await this.postRepository.findOne({ where: { id: createComment.postId } });
    if (!post) {
      throw new NotFoundException(`Post ${createComment.postId} no encontrado`);
    }

    const data: any = {
      content: createComment.content.trim(),
      user: { id: userId },
      post: { id: createComment.postId },
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
    return await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException(`Comentario ${id} no encontrado`);
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este comentario');
    }
    await this.commentRepository.delete(id);
    return { id };
  }

  findById(id: number) {
    return this.commentRepository.findOneBy({ id });
  }

  findAll() {
    return this.commentRepository.find();
  }
}
