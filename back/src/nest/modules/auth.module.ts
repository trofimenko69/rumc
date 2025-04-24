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
    { provide: 'authService', useClass: AuthService },
    { provide: 'tokensService', useClass: TokensService },
    { provide: 'userService', useClass: UserService },
    JwtService,
    JwtStrategy,
  ],
})
export class AuthModule {}
