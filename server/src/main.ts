import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the client
  app.enableCors({
    origin: process.env.CLIENT_URI,
    methods: 'GET,PATCH,POST',
    credentials: true,
  });

  // Enable security headers
  app.use(helmet());

  // Enable validation for the incoming data
  app.useGlobalPipes(new ValidationPipe());

  // Start the server
  await app.listen(5000);
}
bootstrap();
