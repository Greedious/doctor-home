import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './jwt.constants';
import { JWTPayload, buildJWTPayload } from './jwt-payload';
import { Privilege } from 'src/privilege/data/privilege.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // !! remove any and change to real type
  async validate(payload: any) {
    return payload;
  }
}
