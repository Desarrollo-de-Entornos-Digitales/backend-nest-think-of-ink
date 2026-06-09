import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from './like.entity';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    @InjectRepository(PostLike)
    private readonly likesRepository: Repository<PostLike>,
  ) {}

  async like(
    userId: number,
    postId: number,
  ): Promise<{ likesCount: number; likedByCurrentUser: boolean }> {
    try {
      const existing = await this.likesRepository.findOne({
        where: { user: { id: userId }, post: { id: postId } },
      });
      if (existing) {
        await this.likesRepository.delete(existing.id);
        const likesCount = await this.likesRepository.count({
          where: { post: { id: postId } },
        });
        return { likesCount, likedByCurrentUser: false };
      }
      await this.likesRepository.save({
        user: { id: userId },
        post: { id: postId },
      });
      const likesCount = await this.likesRepository.count({
        where: { post: { id: postId } },
      });
      return { likesCount, likedByCurrentUser: true };
    } catch (error) {
      this.logger.error(`Error en like(userId=${userId}, postId=${postId}): ${error instanceof Error ? error.message : error}`);
      this.logger.error(`Stack: ${error instanceof Error ? error.stack : 'N/A'}`);
      throw error;
    }
  }

  async getLikesInfo(
    userId: number,
    postId: number,
  ): Promise<{ likesCount: number; likedByCurrentUser: boolean }> {
    const [likesCount, existing] = await Promise.all([
      this.likesRepository.count({ where: { post: { id: postId } } }),
      this.likesRepository.findOne({
        where: { user: { id: userId }, post: { id: postId } },
      }),
    ]);
    return { likesCount, likedByCurrentUser: !!existing };
  }
}
