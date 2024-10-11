import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StatusRepository } from 'src/university/status/data/status.repository';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly statusRepository: StatusRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const acceptedStatuses = this.reflector.get<string[]>(
      'status',
      context.getHandler(),
    );
    if (!acceptedStatuses || acceptedStatuses.length === 0) {
      return true;
    }

    const universityStatus = await this.statusRepository.findOne({});

    return acceptedStatuses.includes(universityStatus.status);
  }
}
