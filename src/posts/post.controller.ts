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
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikesService } from '../likes/likes.service';
import { commentService } from '../comments/comment.service';
import { CreateComment } from '../comments/dto/create-comment.dto';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role?: string;
  };
}

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likesService: LikesService,
    private readonly commentService: commentService,
  ) {}

  // --- FEED PRINCIPAL ---

  @Get()
  findAll(
    @Query('sort') sort?: string,
    @Query('category') category?: string,
    @Query('userId') userId?: string,
  ) {
    return this.postService.findAll(sort, category, userId ? +userId : undefined);
  }

  // --- CATEGORÍAS (endpoints fijos antes de :id) ---

  @Get('recent')
  findRecent() {
    return this.postService.findRecent();
  }

  @Get('popular')
  findPopular() {
    return this.postService.findPopular();
  }

  @Get('viral')
  findViral() {
    return this.postService.findViral();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  findMyPosts(@Req() req: RequestWithUser) {
    return this.postService.findMyPosts(req.user.id);
  }

  // --- DETALLE ---

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findById(id);
  }

  // --- LIKES ---

  @UseGuards(JwtAuthGuard)
  @Get(':id/likes')
  getLikesInfo(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.likesService.getLikesInfo(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.likesService.like(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.likesService.unlike(req.user.id, id);
  }

  // --- COMENTARIOS ---

  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findByPost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  createComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateComment,
    @Req() req: RequestWithUser,
  ) {
    return this.commentService.create(createCommentDto, req.user.id, id);
  }

  // --- CRUD ---

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePost, @Req() req: RequestWithUser) {
    return this.postService.create(createPostDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePost) {
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.postService.remove(id, req.user.id);
  }
}
