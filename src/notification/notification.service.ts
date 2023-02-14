import {
  SmsStrategy,
  NetGsmStrategy,
  AwsSnsStrategy,
  BypassStrategy,
} from './strategies';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificationService {
  private smsStrategy: SmsStrategy;

  constructor(
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.smsStrategy = this.createSmsStrategy();
  }

  async sendSMS(phone: string, body: string): Promise<boolean> {
    return this.smsStrategy.sendSMS(phone, body);
  }

  private createSmsStrategy(): SmsStrategy {
    if (this.configService.get<boolean>('debug.bypassSms')) {
      return new BypassStrategy(this.logger);
    }

    const smsProvider = this.configService.get<string>('sms.provider');

    switch (smsProvider) {
      case 'netgsm':
        return new NetGsmStrategy(
          this.logger,
          this.configService,
          this.httpService
        );
      case 'aws':
        return new AwsSnsStrategy(this.logger, this.configService);
      default:
        throw new Error(`Invalid SMS provider: ${smsProvider}`);
    }
  }
}
