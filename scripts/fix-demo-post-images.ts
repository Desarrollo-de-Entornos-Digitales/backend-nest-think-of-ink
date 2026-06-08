import { createConnection } from 'typeorm';
import { Post } from '../src/posts/post.entity';
import { User } from '../src/users/user.entity';
import { Role } from '../src/roles/role.entity';
import { Rating } from '../src/ratings/rating.entity';
import { Category } from '../src/category/category.entity';
import { Permission } from '../src/permission/permission.entity';
import { Role_perm } from '../src/role_perm/role_perm/role_perm.entity';
import { Studio } from '../src/studio/studio.entity';
import { PostLike } from '../src/likes/like.entity';
import { Comment } from '../src/comments/comment.entity';

const IMAGE_MAP: Record<string, string> = {
  'Dragón Japonés Blackwork': '/images/tattoos/tattoo-1.jpg',
  'Mandala Geométrico': '/images/tattoos/tattoo-2.jpg',
  'Retrato Marilyn Monroe': '/images/tattoos/tattoo-7.jpg',
  'Acuarela Floral': '/images/tattoos/tattoo-6.jpg',
  'Rosa Fine Line': '/images/tattoos/tattoo-10.jpg',
};

async function fixDemoPostImages() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5433),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'mydatabase',
    entities: [Post, Comment, PostLike, User, Role, Rating, Category, Permission, Role_perm, Studio],
  });

  const postRepo = connection.getRepository(Post);

  const titles = Object.keys(IMAGE_MAP);
  const demoPosts = await postRepo.find({
    where: titles.map(t => ({ title: t })),
  });

  console.log(`Found ${demoPosts.length} demo posts to fix:`);

  for (const post of demoPosts) {
    const newImageUrl = IMAGE_MAP[post.title];
    
    console.log(`  - ID: ${post.id}, Title: "${post.title}"`);
    console.log(`    Old imageUrl: ${post.imageUrl || 'undefined'}`);
    console.log(`    New imageUrl: ${newImageUrl}`);
    
    await postRepo.update(post.id, { imageUrl: newImageUrl });
    console.log(`    ✓ Updated`);
  }

  console.log('\n✅ All demo post images fixed!');
  
  await connection.close();
}

fixDemoPostImages().catch(err => {
  console.error('Fix failed:', err);
  process.exit(1);
});