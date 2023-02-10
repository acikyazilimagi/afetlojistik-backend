import { Module } from '@nestjs/common';
import { AWSSNSService } from './services/aws-sns.service';
@Module({
  providers: [AWSSNSService],
  exports: [AWSSNSService],
})
export class NotificationModule {}
