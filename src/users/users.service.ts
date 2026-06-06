import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUser } from './dto/create-user.dto';

const SEED_USERS = [
  {
    username: 'luisrojas',
    email: 'luisrojas@ink.com',
    password: 'seed123',
    fullName: 'Luis Rojas',
    profession: 'Tatuador Blackwork',
    bio: 'Especialista en blackwork y geometría sagrada',
    city: 'Cali',
    avatarUrl: '/images/avatars/luis-rojas.png',
  },
  {
    username: 'dianacruz',
    email: 'dianacruz@ink.com',
    password: 'seed123',
    fullName: 'Diana Cruz',
    profession: 'Tatuadora Fine Line',
    bio: 'Especialista en Fine Line y tatuajes minimalistas',
    city: 'Cali',
    avatarUrl: '/images/avatars/diana-cruz.png',
  },
  {
    username: 'pablogil',
    email: 'pablogil@ink.com',
    password: 'seed123',
    fullName: 'Pablo Gil',
    profession: 'Tatuador Realismo',
    bio: 'Realismo y retratos en blanco y negro',
    city: 'Medellín',
    avatarUrl: '/images/avatars/pablo-gil.png',
  },
  {
    username: 'sofiatoro',
    email: 'sofiatoro@ink.com',
    password: 'seed123',
    fullName: 'Sofía Toro',
    profession: 'Tatuadora Acuarela',
    bio: 'Arte abstracto y acuarela sobre piel',
    city: 'Bogotá',
    avatarUrl: '/images/avatars/sofia-toro.png',
  },
];

const URL_FIELDS = ['linkedin', 'instagram', 'behance', 'portfolio', 'website'];

const ALLOWED_PROFILE_FIELDS = [
  'fullName', 'username', 'profession', 'description', 'email',
  'website', 'city', 'linkedin', 'behance', 'instagram', 'portfolio',
  'bio', 'avatarUrl', 'location',
];

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepository.count();
    if (count === 0) {
      await this.userRepository.save(SEED_USERS);
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
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
    for (const field of URL_FIELDS) {
      if (updateUser[field] && !/^https?:\/\/.+/.test(updateUser[field])) {
        throw new BadRequestException(`${field} debe ser una URL válida (http/https)`);
      }
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

  async findPublicProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) return null;
    return {
      avatarUrl: user.avatarUrl,
      username: user.username,
      fullName: user.fullName,
      profession: user.profession,
      bio: user.bio,
      website: user.website,
      instagram: user.instagram,
      behance: user.behance,
      portfolio: user.portfolio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.posts?.length ?? 0,
      posts: user.posts,
    };
  }

  async findPublicUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      profileImage: user.avatarUrl,
      description: user.bio || user.description,
      profession: user.profession,
      city: user.city,
      instagram: user.instagram,
      behance: user.behance,
      portfolio: user.portfolio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.posts?.length ?? 0,
    };
  }
}
