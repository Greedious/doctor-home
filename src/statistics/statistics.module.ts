import { Module } from '@nestjs/common';
import { StatisticsController } from './api/controller/statistics.controller';
import { StatisticsService } from './service/statistics.service';
import { OrderModule } from 'src/order/order.module';
import { UserModule } from 'src/account/user/user.module';

@Module({
  imports: [OrderModule, UserModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
