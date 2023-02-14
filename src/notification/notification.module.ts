import { Module } from '@nestjs/common';
import { AwsSnsStrategy } from './strategies';
import { NotificationService } from './notification.service';
import { NetGsmStrategy } from './strategies';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timeout: parseInt(configService.get<string>('http.timeout'), 10),
      }),
    }),
  ],
  providers: [NotificationService, AwsSnsStrategy, NetGsmStrategy],
  exports: [NotificationService],
})
export class NotificationModule {}
