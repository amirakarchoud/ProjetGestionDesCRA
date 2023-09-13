import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@app/guards/HttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    logger: ['debug', 'log', 'warn', 'error', 'verbose'],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Gestion des cra')
    .setDescription('The cra API description')
    .setVersion('1.0')
    .addTag('cra')
    .setExternalDoc('postman collection', '/api-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cors());
  //fill holidays table if it's empty
  const repoHoliday = app.get('IRepoHoliday');
  const isHolidaysTableEmpty = await repoHoliday.checkTableEmpty();
  if (isHolidaysTableEmpty) {
    await repoHoliday.fetchAndStoreHolidays();
  }

  await app.listen(8080, process.env.HOSTNAME || 'localhost');
}

bootstrap();
