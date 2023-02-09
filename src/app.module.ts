import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LoggerModule, LoggerModuleAsyncParams } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: async () => ({
        pinoHttp: {
          level: process.env.LOG_LEVEL || 'debug',
          prettyPrint: process.env.LOG_PRETTY_PRINT || false,
          autoLogging: false,
          formatters: {
            level(label: string) {
              return { level: label };
            },
          },
        },
      }),
    } as LoggerModuleAsyncParams),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
