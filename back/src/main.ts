import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';

let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule, new ExpressAdapter());
  const config = new DocumentBuilder()
    .setTitle('Gestion des cra')
    .setDescription('The cra API description')
    .setVersion('1.0')
    .addTag('cra')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cors());

  new ValidationPipe({
    transform: true,
    forbidUnknownValues: true,
    transformOptions: { enableImplicitConversion: true },
  });

  //helps using class-transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(8080);
}

bootstrap();
