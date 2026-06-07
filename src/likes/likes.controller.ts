import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: number; email: string };
}

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  toggle(@Param('postId', ParseIntPipe) postId: number, @Req() req: RequestWithUser) {
    return this.likesService.like(req.user.id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('post/:postId')
  getLikesInfo(@Param('postId', ParseIntPipe) postId: number, @Req() req: RequestWithUser) {
    return this.likesService.getLikesInfo(req.user.id, postId);
  }
}
