import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { config, customCss, swaggerEnabled } from './utils/swagger.util';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));
  app.enableCors();

  if (swaggerEnabled) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, { customCss });
  }

  await app.listen(PORT);
}

// eslint-disable-next-line no-console
bootstrap().then(() => console.log('Server is running on port:', PORT));
