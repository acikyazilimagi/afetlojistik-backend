import { LoggerModule } from 'nestjs-pino';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'debug',
        autoLogging: false,
        formatters: {
          level(label: string) {
            return { level: label };
          },
        },
      },
    }),
  ],
})
export class LogModule {}
