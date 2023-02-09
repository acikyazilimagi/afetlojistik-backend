import { DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
  .setTitle('Transportation Management System API')
  .build();

const customCss = '.swagger-ui .topbar { display: none }';

export { config, customCss };
