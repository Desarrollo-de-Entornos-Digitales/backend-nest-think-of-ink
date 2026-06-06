import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { StudioService } from './studio.service';
import { PostService } from '../posts/post.service';

@Controller('studios')
export class StudioController {
  constructor(
    private readonly studioService: StudioService,
    private readonly postService: PostService,
  ) {}

  @Get()
  findAll() {
    return this.studioService.findAll();
  }

  @Get('price-range')
  findByPriceRange(
    @Query('min') min?: string,
    @Query('max') max?: string,
  ) {
    return this.studioService.findByPriceRange(
      min ? parseFloat(min) : 0,
      max ? parseFloat(max) : Number.MAX_SAFE_INTEGER,
    );
  }

  @Get('location')
  findByLocation(
    @Query('city') city?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    return this.studioService.findByLocation(
      city,
      lat ? parseFloat(lat) : undefined,
      lng ? parseFloat(lng) : undefined,
    );
  }

  @Get(':id/posts')
  findStudioPosts(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findByStudio(id);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.studioService.findById(id);
  }
}
