import { SetMetadata } from '@nestjs/common';
import { Types } from 'src/account/user/data/user.schema';

export const Roles = (role: Types[]) => SetMetadata('role', role);
