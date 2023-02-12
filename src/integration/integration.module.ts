import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { Integration, IntegrationSchema } from './schemas/integration.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Integration.name,
        schema: IntegrationSchema,
      }
    ]),
  ],
  exports: [IntegrationService],
  controllers:[IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}