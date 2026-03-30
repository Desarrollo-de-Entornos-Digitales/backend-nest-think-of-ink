import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { commentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: commentService) {}

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findById(id);
  }

  @Post()
  create(@Body() CreateComment: any) {
    return this.commentService.create(CreateComment);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: any) {
    return this.commentService.update(id, updateCommentDto);
  }

  // 5. ELIMINAR
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }
}
