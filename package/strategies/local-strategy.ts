import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDashboardService } from '../../src/auth/service/auth-dashboard.service';
import { AuthError } from 'src/auth/service/auth-error.service';
import { passportStrategy } from './constant';
import { buildJWTPayload } from './jwt/jwt-payload';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  passportStrategy.local,
) {
  constructor(
    private readonly authDashboardService: AuthDashboardService,
    private readonly authError: AuthError,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authDashboardService.validateUser(
      username,
      password,
    );
    if (!user) {
      throw new HttpException(
        this.authError.wrongCreds(),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user.dataValues;
  }
}
