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
import { User } from '../users/user.entity';

import { CreateComment } from './dto/create-comment.dto';

@Injectable()
export class commentService {
  private readonly logger = new Logger(commentService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createComment: CreateComment, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id: createComment.postId },
    });
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
      const saved = (await this.commentRepository.save(
        newComment,
      )) as unknown as Comment;
      const comment = await this.commentRepository.findOne({
        where: { id: saved.id },
        relations: ['user'],
      });
      return this.stripPassword(comment);
    } catch (error) {
      this.logger.error(
        `Error al crear comentario: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByPost(postId: number) {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return comments.map((c) => this.stripPassword(c));
  }

  private stripPassword(comment: Comment | null): any {
    if (!comment) return comment;
    const { user, ...rest } = comment as any;
    if (user) {
      const { password, ...safeUser } = user;
      return { ...rest, user: safeUser };
    }
    return rest;
  }

  async remove(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException(`Comentario ${id} no encontrado`);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    const isAdmin = user?.role?.name === 'admin';

    if (comment.user.id !== userId && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este comentario',
      );
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
