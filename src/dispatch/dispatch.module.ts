import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DispatchService } from './dispatch.service';
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
  providers: [DispatchService],
})
export class DispatchModule {}