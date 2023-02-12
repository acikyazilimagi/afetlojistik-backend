import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    {
      ...JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            secret: configService.get('jwt.secret'),
            signOptions: { expiresIn: '1d' },
          };
        },
      }),
      global: true,
    },
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class CoreModule {}
