import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule, new ExpressAdapter());
  await app.init();
  const config = new DocumentBuilder()
    .setTitle('Gestion des cra')
    .setDescription('The cra API description')
    .setVersion('1.0')
    .addTag('cra')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cors());

  let hostname = process.env.HOSTNAME || 'localhost';
  console.log('Hostname is', hostname);

  await app.listen(8080, hostname, () => {});
}
bootstrap();
