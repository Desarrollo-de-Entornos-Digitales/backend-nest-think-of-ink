import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUser } from './dto/create-user.dto';

const ALLOWED_PROFILE_FIELDS = [
  'fullName', 'username', 'profession', 'description', 'email',
  'website', 'city', 'linkedin', 'behance', 'instagram', 'portfolio',
  'bio', 'avatarUrl', 'location',
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async create(createUser: CreateUser) {
    const newUser = this.userRepository.create(createUser);
    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUser: any) {
    if (updateUser.description?.length > 500) {
      throw new BadRequestException('La descripción no puede superar los 500 caracteres');
    }
    if (updateUser.bio?.length > 500) {
      throw new BadRequestException('La biografía no puede superar los 500 caracteres');
    }
    const sanitized: any = {};
    for (const field of ALLOWED_PROFILE_FIELDS) {
      if (updateUser[field] !== undefined) {
        sanitized[field] = updateUser[field];
      }
    }
    await this.userRepository.update(id, sanitized);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) return null;
    const { password, posts, ratingsGiven, ratingsReceived, ...rest } = user as any;
    return {
      ...rest,
      postsCount: posts?.length ?? 0,
    };
  }
}
