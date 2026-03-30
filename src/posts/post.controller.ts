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
import { postService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: postService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findById(id);
  }

  @Post()
  create(@Body() CreatePost: any) {
    return this.postService.create(CreatePost);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() UpdatePost: any) {
    return this.postService.update(id, UpdatePost);
  }

  // 5. ELIMINAR
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
