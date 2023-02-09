import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';

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
    MongooseModule.forRoot(process.env.MONGO_URL),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
