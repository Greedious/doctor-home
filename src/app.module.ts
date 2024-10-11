import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configsSchema } from 'config/conigurations';
import { RoleModule } from './role/role.module';
import { PrivilegeModule } from './privilege/privilege.module';
import { DatabaseModule } from './db/seed/database.module';
import { AuthModule } from './auth/auth.module';
import { OperatorModule } from './account/operator/operator.module';
import { UserModule } from './account/user/user.module';
import { DoctorModule } from './account/doctor/doctor.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageModule } from './image/image.module';
import { AdsModule } from './ads/ads.module';
import { AddressModule } from './address/address.module';
import { VendorModule } from './account/vendor/vendor.module';
import { DiscountModule } from './discount/discount.module';
import { VariantModule } from './variant/variant.module';
import { SkuModule } from './sku/sku.module';
import { OrderModule } from './order/order.module';
import { DeliveryAreaModule } from './delivery-area/delivery-area.module';
import { FavoriteModule } from './favorite/favorite.module';
import { UniversityOperatorModule } from './university/account/operator/operator.module';
import { StudentModule } from './university/student/student.module';
import { SubjectModule } from './university/subject/subject.module';
import { YearModule } from './university/year/year.module';
import { GroupModule } from './university/group/group.module';
import { TeacherModule } from './university/teacher/teacher.module';
import { ReviewModule } from './review/review.module';
import { ChairModule } from './university/chair/chair.module';
import { StatusModule } from './university/status/status.module';
import { QuestionModule } from './university/question/question.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TaskModule } from './university/task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDbConfig } from './db/mongodb/config';
import { PatientModule } from './university/patient/patient.module';
import { AppointmentModule } from './university/appointment/appointment.module';
import { RequestPatientModule } from './university/request-patient/request-patient.module';
import { SupervisorModule } from './university/supervisor/supervisor.module';
import { UniversityStatisticsModule } from './university/statistics/university-statistics.module';
import { PatientReportModule } from './university/patient-report/patient-report.module';
import { MarkModule } from './university/mark/mark.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configsSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..'),
    }),

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      sync: {
        alter: true,
      },
    }),

    MongooseModule.forRoot(mongoDbConfig.url, {
      dbName: mongoDbConfig.name,
    }),

    // RedisConnection,

    PrivilegeModule,
    RoleModule,
    DatabaseModule,
    AuthModule,
    OperatorModule,
    UserModule,
    DoctorModule,
    CategoryModule,
    UploadModule,
    ImageModule,
    AdsModule,
    AddressModule,
    VendorModule,
    DiscountModule,
    VariantModule,
    SkuModule,
    DeliveryAreaModule,
    OrderModule,
    FavoriteModule,
    UniversityOperatorModule,
    StudentModule,
    SubjectModule,
    GroupModule,
    YearModule,
    TeacherModule,
    ReviewModule,
    ChairModule,
    StatusModule,
    QuestionModule,
    StatisticsModule,
    TaskModule,
    PatientModule,
    AppointmentModule,
    RequestPatientModule,
    SupervisorModule,
    UniversityStatisticsModule,
    PatientReportModule,
    SupervisorModule,
    MarkModule,
  ],
  providers: [],
})
export class AppModule {}
