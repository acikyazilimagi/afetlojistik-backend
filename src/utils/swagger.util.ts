import { DocumentBuilder } from '@nestjs/swagger';
import * as process from 'process';

const config = new DocumentBuilder()
  .setTitle('Transportation Management System API')
  .build();

const customCss = '.swagger-ui .topbar { display: none }';

const swaggerEnabled = process.env.SWAGGER_ENABLED !== 'false';

export { config, customCss, swaggerEnabled };
