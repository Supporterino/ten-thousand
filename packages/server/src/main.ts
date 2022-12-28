import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { GameIoAdapter } from '@app/websockets/game-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useWebSocketAdapter(new GameIoAdapter(app));

  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.disable('x-powered-by');
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  await app.listen(3001);
}
bootstrap();
