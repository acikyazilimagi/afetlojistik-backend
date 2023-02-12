import { Global, Module } from '@nestjs/common';
import { AbstractServiceClient } from './base.service-client';

@Global()
@Module({
  providers: [],
  exports: [AbstractServiceClient],
})
export class ServiceClientModule {}
