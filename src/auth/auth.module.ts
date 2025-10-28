import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.stragegy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  imports: [
    forwardRef(() => UserModule),
    // ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret:
        '93d61e4686e3afad35df0b00198771ea33876fb9a2ad030a05b04e545d7bb4c2',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
