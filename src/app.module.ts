import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from './location/location.module';

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
    MongooseModule.forRoot(''),
    HealthModule,
    LocationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
