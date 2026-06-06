import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { commentService } from './comment.service';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentController],
  providers: [commentService],
  exports: [commentService],
})
export class CommentsModule {}
