import { Timestamp } from 'typeorm';

export class CreateComment {
  text: string;
  createdAt: Timestamp;
}
