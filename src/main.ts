import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { config, customCss } from './utils/swagger.util';
import { ExceptionsFilter } from './common/filters/exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new ExceptionsFilter(app.get(Logger)));
  app.enableCors();

  if (configService.get<boolean>('swagger.enabled')) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, { customCss });
  }

  await app.listen(configService.get<number>('port'));
  return app;
}

// eslint-disable-next-line no-console
bootstrap().then((app) =>
  console.log('Server is running on port:', app.get(ConfigService).get('port'))
);
