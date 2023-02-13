import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { DispatchService } from './dispatch.service';
import { OptiyolServiceClient } from './optiyol.service-client';
import { Dispatch, DispatchSchema } from './schema/dispatch.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DispatchController } from './dispatch.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Dispatch.name,
        schema: DispatchSchema,
      },
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timeout: parseInt(configService.get<string>('http.timeout'), 10),
        baseURL: configService.get<string>('optiyol.baseUrl'),
      }),
    }),
  ],
  exports: [DispatchService],
  providers: [DispatchService, OptiyolServiceClient],
})
export class DispatchModule {}
