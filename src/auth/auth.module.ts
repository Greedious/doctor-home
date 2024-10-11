import { Module } from '@nestjs/common';
import { AuthDashboardService } from './service/auth-dashboard.service';
import { AuthDashboardController } from './api/controller/auth-dashboard.controller';
import { UserModule } from 'src/account/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'package/strategies/jwt/jwt.constants';
import { LocalStrategy } from 'package/strategies/local-strategy';
import { JwtStrategy } from 'package/strategies/jwt/jwt.strategy';
import { AuthValidation } from './api/validation';
import { AuthError } from './service/auth-error.service';
import { AuthMobileController } from './api/controller/auth-mobile.controller';
import { AuthMobileService } from './service/auth-mobile.service';
import { RoleModule } from 'src/role/role.module';
import { LocalMobileStrategy } from './passport/localMobile.strategy';
import { DoctorMobileService } from 'src/account/doctor/service/doctor-mobile.service';
import { DoctorModule } from 'src/account/doctor/doctor.module';
import { AuthVendorDashboardController } from './api/controller/auth-dashboard-vendor.controller';
import { AuthVendorDashboardService } from './service/auth-vendor.service';
import { AuthUniversityDashboardController } from './api/controller/auth-university-dashboard.controller';
import { LocalUniversityStrategy } from './passport/local-university-strategy';
import { AuthUniversityDashboardService } from './service/auth-university-dashboard.service';

@Module({
  imports: [
    RoleModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    DoctorModule,
  ],
  providers: [
    AuthDashboardService,
    AuthMobileService,
    LocalStrategy,
    LocalMobileStrategy,
    LocalUniversityStrategy,
    JwtStrategy,
    AuthValidation,
    AuthError,
    DoctorMobileService,
    AuthVendorDashboardService,
    AuthUniversityDashboardService,
  ],
  controllers: [
    AuthDashboardController,
    AuthMobileController,
    AuthVendorDashboardController,
    AuthUniversityDashboardController,
  ],
  exports: [AuthDashboardService],
})
export class AuthModule {}
