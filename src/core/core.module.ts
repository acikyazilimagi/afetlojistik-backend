import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies';

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
