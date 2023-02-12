import { DocumentBuilder } from '@nestjs/swagger';
import * as process from 'process';

const config = new DocumentBuilder()
  .setTitle('Transportation Management System API')
  .build();

const customCss = '.swagger-ui .topbar { display: none }';

export { config, customCss };
