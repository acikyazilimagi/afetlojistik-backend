import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNS, Credentials } from 'aws-sdk';
import { PinoLogger } from 'nestjs-pino';
import { SmsStrategy } from './sms.strategy';

@Injectable()
export class AwsSnsStrategy implements SmsStrategy {
  private readonly sns: SNS;

  constructor(
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService
  ) {
    const config: {
      accessKey: string;
      secretAccessKey: string;
      region: string;
    } = this.configService.get('sms.aws');

    const accessKeyId = config.accessKey;
    const secretAccessKey = config.secretAccessKey;
    const region = config.region;

    const credentials = new Credentials({ accessKeyId, secretAccessKey });
    this.sns = new SNS({ apiVersion: '2010-03-31', credentials, region });
  }

  async sendSMS(phone: string, body: string): Promise<boolean> {
    const params = {
      Message: body,
      PhoneNumber: phone,
    };

    try {
      const publishResult = await this.sns.publish(params).promise();
      return publishResult.$response.error === null;
    } catch (error) {
      this.logger.error(`[AWSSNSService] sendSMS: ${error}`);
      return false;
    }
  }
}
