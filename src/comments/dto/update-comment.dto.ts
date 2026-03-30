import { CreateComment } from './create-comment.dto';

import { PartialType } from '@nestjs/mapped-types';

export class Updatecomment extends PartialType(CreateComment) {}
