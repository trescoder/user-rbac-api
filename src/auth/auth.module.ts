import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-strategy/local.strategy';
import { JwtStrategy } from './jwt-strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './jwt-strategy/jwt.guard';
import { RepositoryModule } from 'src/shared/repositories/repository.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: 'supersecret',
      signOptions: { expiresIn: '50m' },
    }),
    RepositoryModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
