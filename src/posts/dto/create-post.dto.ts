import { Timestamp } from 'typeorm';

export class CreatePost {
  content: string;
  imageUrl: string;
  createdAt: Timestamp;
}
