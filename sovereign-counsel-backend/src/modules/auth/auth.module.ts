import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';


@Global()

@Module({

  

  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
    }),
    JwtModule.register({
  secret: process.env.JWT_SECRET || 'fallback_secret',
  signOptions: { expiresIn: '1d' },
}),
  ],
  
  controllers: [AuthController ],
  providers: [AuthService, JwtStrategy],
  exports: [
    AuthService,
    JwtModule, // 🔥 ADD THIS LINE (CRITICAL)
  ],
})
export class AuthModule {}