import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // Aquí estaba el problema, cámbialo a 'name'
  name: string;

  @Column({ nullable: true }) // Opcional: una descripción
  description: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
