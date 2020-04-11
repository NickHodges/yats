import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import CookieParser from 'cookie-parser';
import fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./Nicklocalhost.key'),
    cert: fs.readFileSync('./Nicklocalhost.crt')
  };

  const TodoServer = await NestFactory.create(AppModule, { httpsOptions });
  TodoServer.use(CookieParser('secret'));
  TodoServer.useGlobalPipes(new ValidationPipe({ transform: true }));
  TodoServer.enableCors({
    credentials: true,
    origin: true
  });

  await TodoServer.listen(3000);
}
bootstrap();
