import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { PostService } from '../posts/post.service';
import { UpdateProfile } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: number; email: string };
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly postService: PostService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.userService.findProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Body() updateProfileDto: UpdateProfile, @Req() req: RequestWithUser) {
    return this.userService.update(req.user.id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return this.userService.findById(req.user.id);
  }

  @Get(':id/profile')
  findPublicProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findPublicProfile(id);
  }

  @Get(':id/posts')
  findUserPosts(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findMyPosts(id);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findPublicUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMe(@Body() updateProfileDto: UpdateProfile, @Req() req: RequestWithUser) {
    return this.userService.update(req.user.id, updateProfileDto);
  }

  @Post()
  create(@Body() CreateUser: any) {
    return this.userService.create(CreateUser);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() UpdateUser: any) {
    return this.userService.update(id, UpdateUser);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
