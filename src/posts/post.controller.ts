import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express'; // Importación necesaria
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role?: string; // Opcional, por si lo tienes en tu token
  };
}

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // --- RUTAS DE LECTURA ---

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  // 1. Ruta fija ANTES de ':id' para evitar conflictos
  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  findMyPosts(@Req() req: RequestWithUser) {
    // Ahora 'req.user.id' es seguro y el linter no marcará error
    const userId = req.user.id;
    return this.postService.findMyPosts(userId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findById(id);
  }

  // --- RUTAS DE ACCIÓN ---

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: any) {
    // Puedes cambiar 'any' por tu CreatePostDto si lo tienes
    return this.postService.create(createPostDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: any) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
