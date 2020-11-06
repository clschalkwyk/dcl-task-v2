import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

require('dotenv').config();

let port: number = 3000;
if ('NODE_PORT' in process.env) {
  port = parseInt(process.env.NODE_PORT);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  console.log(`API-TASKS Running on ${port}`);
}

bootstrap();
