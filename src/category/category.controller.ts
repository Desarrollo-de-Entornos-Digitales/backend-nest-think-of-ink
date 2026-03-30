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
import { categoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: categoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findById(id);
  }

  @Post()
  create(@Body() createCategoryDto: any) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: any,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  // 5. ELIMINAR
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
