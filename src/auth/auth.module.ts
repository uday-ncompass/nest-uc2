import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [ConfigModule.forRoot(), forwardRef(() => UserModule), PassportModule.register({session: true}), JwtModule.register({
    secret: "secret",
    signOptions: {expiresIn: '30m'}
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
  exports: [AuthService]
})
export class AuthModule {}
