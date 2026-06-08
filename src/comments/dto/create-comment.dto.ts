import { IsNotEmpty, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreateComment {
  @IsInt()
  @IsPositive()
  postId: number;

  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @MaxLength(500, {
    message: 'El comentario no puede superar los 500 caracteres',
  })
  content: string;
}
