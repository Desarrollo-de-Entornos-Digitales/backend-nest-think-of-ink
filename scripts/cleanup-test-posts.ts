import { createConnection } from 'typeorm';
import { Post } from '../src/posts/post.entity';
import { Comment } from '../src/comments/comment.entity';
import { PostLike } from '../src/likes/like.entity';
import { User } from '../src/users/user.entity';
import { Role } from '../src/roles/role.entity';
import { Rating } from '../src/ratings/rating.entity';
import { Category } from '../src/category/category.entity';
import { Permission } from '../src/permission/permission.entity';
import { Role_perm } from '../src/role_perm/role_perm/role_perm.entity';
import { Studio } from '../src/studio/studio.entity';
import * as fs from 'fs';
import * as path from 'path';

async function cleanup() {
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
  const commentRepo = connection.getRepository(Comment);
  const likeRepo = connection.getRepository(PostLike);

  const testTitles = ['Test Image Post', 'ola'];
  const testPosts = await postRepo.find({ where: testTitles.map(t => ({ title: t })) });

  console.log(`Found ${testPosts.length} test posts to delete:`);
  for (const post of testPosts) {
    console.log(`  - ID: ${post.id}, Title: "${post.title}", Image: ${post.imageUrl}`);

    if (post.imageUrl && post.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', 'uploads', 'posts', path.basename(post.imageUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`    Deleted file: ${filePath}`);
      }
    }

    await postRepo.delete(post.id);
    console.log(`    Deleted post from database`);
  }

  const orphanedComments = await commentRepo.count({ where: { post: { id: -1 } } });
  const orphanedLikes = await likeRepo.count({ where: { post: { id: -1 } } });

  const uploadsDir = path.join(__dirname, '..', 'uploads', 'posts');
  const dbPosts = await postRepo.find();
  const dbImages = new Set(dbPosts.map(p => p.imageUrl).filter(Boolean));

  const allFiles = fs.readdirSync(uploadsDir);
  let orphanedCount = 0;
  for (const file of allFiles) {
    const urlPath = `/uploads/posts/${file}`;
    if (!dbImages.has(urlPath)) {
      const fullPath = path.join(uploadsDir, file);
      fs.unlinkSync(fullPath);
      console.log(`Deleted orphaned file: ${file}`);
      orphanedCount++;
    }
  }
  console.log(`\nDeleted ${orphanedCount} orphaned files`);
  console.log('Cleanup complete!');

  await connection.close();
}

cleanup().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
