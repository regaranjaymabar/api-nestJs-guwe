import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { TransformResponseInterceptor } from './interceptor/transform-response/transform-response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new (await import('@nestjs/common')).ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  


  app.useGlobalInterceptors(new TransformResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
