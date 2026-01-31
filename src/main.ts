import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const validationPipeOptions: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  };

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
