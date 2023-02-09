import { Injectable } from '@nestjs/common';
import { Health } from './health.types';
import { LogMe } from '../common/decorators/log.decorator';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class HealthService {
  constructor(private readonly logger: PinoLogger) {}
  @LogMe()
  health(): Health {
    return {
      time: Date.now(),
      status: 'OK',
    };
  }
}
