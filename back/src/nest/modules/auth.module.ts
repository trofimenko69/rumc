import {
  AUTH_SERVICE_SYMBOL,
  TOKENS_SERVICE_SYMBOL,
  USER_SERVICE_SYMBOL,
} from '@common/constants';
import { JwtStrategy } from '@infrastructure/JWT/jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '@presentation/controllers';
import { AuthService } from '@use-cases/auth/auth.service';
import { TokensService } from '@use-cases/tokens/tokens.service';
import { UserService } from '@use-cases/user/user.service';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: AUTH_SERVICE_SYMBOL, useClass: AuthService },
    { provide: TOKENS_SERVICE_SYMBOL, useClass: TokensService },
    { provide: USER_SERVICE_SYMBOL, useClass: UserService },
    JwtService,
    JwtStrategy,
  ],
  exports: [USER_SERVICE_SYMBOL, TOKENS_SERVICE_SYMBOL, AUTH_SERVICE_SYMBOL],
})
export class AuthModule {}
