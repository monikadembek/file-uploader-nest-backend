import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const env = configService.get<string>('nodeEnv');
  const clientOrigin = configService.get<string>('clientOrigin');

  // commented out due to errors during build on Vercel
  // check how to fix it
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: clientOrigin || '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });
  await app.listen(port);
  console.log(`App listens on port: ${port} | environment: ${env}`);
}
bootstrap();
