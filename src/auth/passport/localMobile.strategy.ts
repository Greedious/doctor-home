import * as joi from 'joi';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { passportStrategy } from 'package/strategies/constant';
import { validationSchema } from 'package/validation';
import { AuthError } from '../service/auth-error.service';
import { AuthMobileService } from '../service/auth-mobile.service';
import { buildJWTPayload } from 'package/strategies/jwt/jwt-payload';
import { errorCode } from 'package/utils/Error/error-codes';
import { JoiValidationPipe } from 'package/validation/joi.pips';

@Injectable()
export class LocalMobileStrategy extends PassportStrategy(
  Strategy,
  passportStrategy.localMobile,
) {
  constructor(
    private authError: AuthError,
    private localSignInService: AuthMobileService,
  ) {
    super({
      usernameField: 'phoneNumber',
      passwordField: 'otp',
    });
  }

  async validate(phoneNumber: string, otp: string): Promise<any> {
    const validateSchema = joi
      .object({
        phoneNumber: validationSchema.phoneNumber().required(),
        otp: joi
          .string()
          .min(4)
          .max(4)
          .pattern(/^[0-9]*$/)
          .required(),
      })
      .required();
    new JoiValidationPipe(validateSchema).transform({
      phoneNumber,
      otp,
    });
    // if (error)
    //   throw new HttpException(
    //     {
    //       code: errorCode.loginFailed,
    //       message: error?.details.flatMap((val) => {
    //         return {
    //           message: val.message.split('"').join(''),
    //           path: val.context.label,
    //         };
    //       }),
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    const account = await this.localSignInService.validateAccountMobile(
      phoneNumber,
      otp,
    );

    if (!account.type)
      throw new HttpException(
        this.authError.wrongCreds(),
        HttpStatus.UNAUTHORIZED,
      );
    return account;
  }
}
