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
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { LikesService } from '../likes/likes.service';
import { commentService } from '../comments/comment.service';

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

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query('sort') sort?: string,
    @Query('category') category?: string,
    @Query('userId') userId?: string,
  ) {
    return this.postService.findAll(sort, category, userId ? +userId : undefined, req.user?.id);
  }

  // --- CATEGORÍAS (endpoints fijos antes de :id) ---

  @UseGuards(OptionalJwtAuthGuard)
  @Get('recent')
  findRecent(@Req() req: RequestWithUser) {
    return this.postService.findRecent(req.user?.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('popular')
  findPopular(@Req() req: RequestWithUser) {
    return this.postService.findPopular(req.user?.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('viral')
  findViral(@Req() req: RequestWithUser) {
    return this.postService.findViral(req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  findMyPosts(@Req() req: RequestWithUser) {
    return this.postService.findMyPosts(req.user.id, req.user.id);
  }

  // --- FILTRO POR PRECIO (antes de :id) ---

  @UseGuards(OptionalJwtAuthGuard)
  @Get('filter-by-price')
  filterByPrice(
    @Req() req: RequestWithUser,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort?: string,
  ) {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;

    if (minPrice && (isNaN(min) || min < 0)) {
      throw new BadRequestException('minPrice debe ser un número positivo');
    }
    if (maxPrice && (isNaN(max) || max < 0)) {
      throw new BadRequestException('maxPrice debe ser un número positivo');
    }
    if (minPrice && maxPrice && min > max) {
      throw new BadRequestException('minPrice no puede ser mayor que maxPrice');
    }

    return this.postService.filterByPrice(min, max, sort, req.user?.id);
  }

  // --- DETALLE ---

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.postService.findById(id, req.user?.id);
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

  // --- COMENTARIOS ---

  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findByPost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  createComment(
    @Body() createCommentDto: any,
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    createCommentDto.postId = id;
    return this.commentService.create(createCommentDto, req.user.id);
  }

  // --- CRUD ---

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'posts'),
        filename: (_req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          return callback(new BadRequestException('Solo se permiten archivos jpg, jpeg, png o webp'), false);
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Body() body: any,
    @UploadedFile() file: any,
    @Req() req: RequestWithUser,
  ) {
    const imageUrl = file ? `/uploads/posts/${file.filename}` : undefined;
    const createPostDto: CreatePost = {
      title: body.title,
      content: body.content,
      location: body.location,
      postType: body.postType,
      category: body.category ? { name: body.category } : undefined,
      priceMin: body.priceMin ? Number(body.priceMin) : undefined,
      priceMax: body.priceMax ? Number(body.priceMax) : undefined,
    };
    return this.postService.create(createPostDto, req.user.id, imageUrl);
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
