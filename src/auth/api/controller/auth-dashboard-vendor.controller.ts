import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'package/guards/local-auth-guard';
import { LoginDto } from '../dto';
import { AuthValidation } from '../validation';
import { User } from 'package/decorator/param/user.decorator';
import { AuthVendorDashboardService } from 'src/auth/service/auth-vendor.service';

@Controller('/vendor/auth')
export class AuthVendorDashboardController {
  constructor(
    private readonly authDashboardService: AuthVendorDashboardService,
    private readonly authValidation: AuthValidation,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard) // checked if the user does exist in our database
  async login(@Body() body: LoginDto, @User() user) {
    return await this.authDashboardService.login(body, user);
  }
}
