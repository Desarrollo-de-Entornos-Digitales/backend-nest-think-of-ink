import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { email: string; password: string; roleName: string }) {
    return this.usersService.create(body.email, body.password, body.roleName);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}