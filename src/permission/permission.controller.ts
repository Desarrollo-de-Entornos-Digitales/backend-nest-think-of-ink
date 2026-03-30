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
import { permissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: permissionService) {}

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findById(id);
  }

  @Post()
  create(@Body() CreatePermission: any) {
    return this.permissionService.create(CreatePermission);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() UpdatePermission: any) {
    return this.permissionService.update(id, UpdatePermission);
  }

  // 5. ELIMINAR
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }
}
