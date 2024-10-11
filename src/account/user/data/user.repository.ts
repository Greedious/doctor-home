import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.schema';

@Injectable()
export class UserRepository extends SequelizeRepository<User> {
  constructor(
    @InjectModel(User)
    UserRepository: typeof User,
  ) {
    super(UserRepository);
  }
}
