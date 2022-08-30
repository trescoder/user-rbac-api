import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // strip validated object of any properties that do not use any validation decorator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: 'http://localhost:4200' });
  await app.listen(3000);
}
bootstrap();
