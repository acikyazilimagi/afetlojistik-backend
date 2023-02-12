import { LoggerModule } from 'nestjs-pino';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get('log.level'),
          autoLogging: false,
          formatters: {
            level(label: string) {
              return { level: label };
            },
          },
        },
      }),
    }),
  ],
})
export class LogModule {}
