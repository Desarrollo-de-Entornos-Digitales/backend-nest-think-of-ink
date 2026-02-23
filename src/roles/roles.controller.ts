import { Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  // Ejecutas esto 1 vez para crear Admin/Tatuador/Regular
  @Post('seed')
  seed() {
    return this.rolesService.seedDefaults();
  }
}