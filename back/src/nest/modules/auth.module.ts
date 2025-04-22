import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@presentation/controllers';
import { AuthService } from '@use-cases/auth/auth.service';
import { UserService } from '@use-cases/user/user.service';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'userService',
      useClass: UserService,
    },
  ],
})
export class AuthModule {}
