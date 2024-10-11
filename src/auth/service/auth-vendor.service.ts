import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from '../api/dto';
import { Types, User } from 'src/account/user/data/user.schema';
import { buildJWTPayload } from 'package/strategies/jwt/jwt-payload';
import { UserService } from 'src/account/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserError } from 'src/account/user/service/user-error.service';

@Injectable()
export class AuthVendorDashboardService {
  constructor(
    private userService: UserService,
    private userError: UserError,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginDto, curUser: User) {
    if ([Types.ADMIN, Types.SUPER_ADMIN].includes(curUser.type)) {
      throw new HttpException(this.userError.notFound(), HttpStatus.NOT_FOUND);
    }
    const jwtPayload = buildJWTPayload(curUser);
    console.log('jwtPayload', jwtPayload);
    return {
      user: curUser,
      accessToken: this.jwtService.sign(jwtPayload),
    };
  }
}
