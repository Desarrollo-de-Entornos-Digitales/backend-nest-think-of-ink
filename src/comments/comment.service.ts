import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './comment.entity';

import { CreateComment } from './dto/create-comment.dto';
import { Updatecomment } from './dto/update-comment.dto';

@Injectable()
export class commentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async create(createComment: CreateComment) {
    const newComment = this.commentRepository.create({
      ...createComment,
    });

    return this.commentRepository.save(newComment);
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
