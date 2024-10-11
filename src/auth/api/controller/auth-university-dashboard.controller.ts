import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'package/guards/local-auth-guard';
import { AuthDashboardService } from 'src/auth/service/auth-dashboard.service';
import { LoginDto } from '../dto';
import { AuthValidation } from '../validation';
import { User } from 'package/decorator/param/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { passportStrategy } from 'package/strategies/constant';
import { AuthUniversityDashboardService } from 'src/auth/service/auth-university-dashboard.service';

@Controller('/university/auth')
export class AuthUniversityDashboardController {
  constructor(
    private readonly authDashboardService: AuthUniversityDashboardService,
    private readonly authValidation: AuthValidation,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard(passportStrategy.localUniversity)) // checked if the user does exist in our database
  async login(@Body() body: LoginDto, @User() user) {
    return await this.authDashboardService.login(body, user);
  }
}
