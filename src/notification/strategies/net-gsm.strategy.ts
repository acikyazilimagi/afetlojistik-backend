import { SmsStrategy } from './sms.strategy';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NetGsmStrategy implements SmsStrategy {
  private readonly username: string;
  private readonly password: string;
  private readonly originator: string;
  private readonly url: string;

  constructor(
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    const smsConfig = this.configService.get<{
      username: string;
      password: string;
      originator: string;
      url: string;
    }>('sms.netGsm');
    this.username = smsConfig.username;
    this.password = smsConfig.password;
    this.originator = smsConfig.originator;
    this.url = smsConfig.url;
  }

  async sendSMS(phone: string, body: string): Promise<boolean> {
    const params = new URLSearchParams({
      usercode: this.username,
      password: this.password,
      gsmno: phone,
      message: body,
      msgheader: this.originator,
    });

    try {
      const response = await this.httpService.axiosRef.post(this.url, params);
      const responseText = response.data.toString();
      const isSuccess = responseText.startsWith('00');

      if (!isSuccess) {
        this.logger.error(
          `[NetGsmStrategy] sendSMS ResponseCode: ${responseText}`
        );
      }

      return isSuccess;
    } catch (error) {
      this.logger.error(`[NetGsmStrategy] sendSMS: ${error}`);
      return false;
    }
  }
}
