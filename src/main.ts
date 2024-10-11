import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'package/exception/http-exception.interseptor';
import { Logger } from '@nestjs/common';
import { ResponseInterceptor } from 'package/http/response/response.interceptor';
import { LoggingInterceptor } from 'package/http/request/request.interceptor';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor(new Logger()));
  app.useGlobalFilters(new AllExceptionsFilter(new Logger()));
  app.setGlobalPrefix('api/v1');

  config();
  await app.listen(process.env.API_PORT || 3000, () => {
    console.log('running app on port 3000');
  });
}

bootstrap();
