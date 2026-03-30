import { CreatePost } from './create-post.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdatePost extends PartialType(CreatePost) {}
