import { UseGuards, applyDecorators } from '@nestjs/common';
import { universityStatus } from 'src/university/status/api/dto/request';
import { UniversityStatus } from './univeristy-status-metadata.decorator';
import { StatusGuard } from '../guards/university-status.guards';

export function AuthorizedStatus({ status }: { status: universityStatus[] }) {
  return applyDecorators(UniversityStatus(status), UseGuards(StatusGuard));
}
