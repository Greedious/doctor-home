import { SetMetadata } from '@nestjs/common';
import { universityStatus } from 'src/university/status/api/dto/request';

export const UniversityStatus = (status: universityStatus[]) =>
  SetMetadata('status', status);
