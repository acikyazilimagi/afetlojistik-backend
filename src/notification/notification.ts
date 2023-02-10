import { Injectable } from '@nestjs/common';

import { SNS, SharedIniFileCredentials, config } from 'aws-sdk';

@Injectable()
export class AWSSNSService {
  constructor() {
    const credentials = new SharedIniFileCredentials({ profile: 'moria' });
    config.credentials = credentials;
    // Set the region
    config.update({ region: 'eu-west-1' });
  }

  async sendSMS(phone: string, body: string): Promise<boolean> {
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
    return false;
  }
}
