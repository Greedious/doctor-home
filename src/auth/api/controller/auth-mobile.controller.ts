import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDoctorRequest, OtpRequest } from '../dto/request';
import { AuthMobileService } from 'src/auth/service/auth-mobile.service';
import { AuthValidation } from '../validation';
import { generateOtp } from 'src/auth/helper/generate-otp';
import { AuthGuard } from '@nestjs/passport';
import { passportStrategy } from 'package/strategies/constant';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('/mobile/auth')
export class AuthMobileController {
  constructor(
    private readonly authService: AuthMobileService,
    private readonly authValidation: AuthValidation,
  ) {}

  @Post('/signup')
  @UseInterceptors(TransactionInterceptor)
  async signup(
    @Body() body: CreateDoctorRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.authValidation.signupMobile({ body });
    await this.authService.isRegistered(body.phoneNumber);
    await this.authService.create(body, transaction);
    // return { id: user.id };
  }

  @UseGuards(AuthGuard(passportStrategy.localMobile))
  @Post('/login')
  async login(@Req() { user }) {
    return await this.authService.login(user);
  }

  @Post('/ask-for-otp')
  async askForOtp(@Body() body: OtpRequest) {
    this.authValidation.askForOtp({ body });
    await this.authService.isNotRegistered(body.phoneNumber);
    const otp = generateOtp();
    await this.authService.askForOtp(body, otp);
    return;
  }
}
