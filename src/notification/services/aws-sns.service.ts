import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { config, Credentials, SNS } from 'aws-sdk';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AWSSNSService implements OnModuleInit {
  private awsRegion: string;
  private awsAccessKey: string;
  private awsSecretKey: string;
  private debugBypassSms: boolean;

  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService
  ) {}

  onModuleInit() {
    this.awsRegion = this.configService.get('aws.region');
    this.awsAccessKey = this.configService.get('aws.accessKey');
    this.awsSecretKey = this.configService.get('aws.secretAccessKey');
    this.debugBypassSms = this.configService.get('debug.bypassSms');

    const credentials = new Credentials({
      accessKeyId: this.awsAccessKey,
      secretAccessKey: this.awsSecretKey,
    });
    config.credentials = credentials;
    // Set the region
    config.update({ region: this.awsRegion });
  }

  async sendSMS(phone: string, body: string): Promise<boolean> {
    if (this.debugBypassSms) return true;

    // Create publish parameters
    const params = {
      Message: JSON.stringify(body) /* required */,
      PhoneNumber: phone,
    };

    // Create the promise and SES service object
    const sns = new SNS({ apiVersion: '2010-03-31' });
    const publishResult = await sns.publish(params).promise();
    if (publishResult.$response.error === null) {
      return true;
    }
    this.logger.error(
      `[AWSSNSService] sendSMS: ${publishResult.$response.error}`
    );
    return false;
  }
}
