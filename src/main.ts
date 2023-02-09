import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));

  if (!(process.env.ENV === 'prod')) {
    const config = new DocumentBuilder()
      .setTitle('Transportation Management System API')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customCss: '.swagger-ui .topbar { display: none }',
    });
  }

  await app.listen(PORT);
}

bootstrap().then(() => console.log('Server is running on port:', PORT));
