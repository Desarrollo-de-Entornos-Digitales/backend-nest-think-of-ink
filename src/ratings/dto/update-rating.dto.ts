import { CreateRating } from './create-rating.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateRating extends PartialType(CreateRating) {}
