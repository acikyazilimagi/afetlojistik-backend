import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { jwtConstants } from 'src/constants';

@Module({
  imports: [
    {
      ...JwtModule.registerAsync({
        useFactory: async () => {
          return {            
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
          };
        },
      }),
      global: true,
    },
  ],
  providers:[JwtStrategy],
  exports: [JwtModule],
})
export class CoreModule {}
