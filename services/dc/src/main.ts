import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = 2000;
  const options = new DocumentBuilder()
    .setTitle('Planning Operations')
    .setDescription('')
    .setVersion('1.0')
    // .setBasePath(`${ptsConfigs.swagger.basePath}`)
    .addBearerAuth()
    .addTag('ms')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`api`, app, document);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.enableCors();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
