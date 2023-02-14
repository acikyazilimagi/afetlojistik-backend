import { SmsStrategy } from './sms.strategy';
import { PinoLogger } from 'nestjs-pino';

export class BypassStrategy implements SmsStrategy {
  constructor(private readonly logger: PinoLogger) {}
  async sendSMS(phone: string, body: string): Promise<boolean> {
    this.logger.info(`[DebugStrategy] sendSMS: ${{ phone, body }}`);
    return true;
  }
}
