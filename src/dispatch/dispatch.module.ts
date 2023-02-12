import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DispatchService } from './dispatch.service';
import { OptiyolServiceClient } from './optiyol.service-client';
import { Dispatch, DispatchSchema } from './schema/dispatch.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Dispatch.name,
        schema: DispatchSchema,
      },
    ]),
  ],
  exports: [DispatchService],
  providers: [DispatchService, OptiyolServiceClient],
})
export class DispatchModule {}