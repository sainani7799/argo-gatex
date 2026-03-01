import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { HttpExceptionFilter } from '@gatex/backend-utils';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { AppModule } from './app/app.module';
import { createDocument } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = parseInt(process.env.APP_SERVER_PORT || '3338', 10);
  createDocument(app);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  app.use(bodyParser.urlencoded({ limit: configService.get('maxPayloadSize'), extended: true }));
  app.use(bodyParser.json({ limit: configService.get('maxPayloadSize') }));
  app.useGlobalPipes(new ValidationPipe({ validationError: { target: false }, transform: true, forbidUnknownValues: false }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
