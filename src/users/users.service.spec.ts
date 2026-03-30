import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(gmail: string, password: string, roleName: string) {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) throw new BadRequestException('Role not found');

    const user = this.userRepository.create({
      email: gmail,
      password,
      role,
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({ relations: { role: true } });
  }
}