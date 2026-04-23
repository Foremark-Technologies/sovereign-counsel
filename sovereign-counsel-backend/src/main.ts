import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './config/bootstrap.config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters({
    catch(exception) {
      console.error("🔥 FULL ERROR:", exception);
      throw exception;
    },
  });
  
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
