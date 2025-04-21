import {Module} from "@nestjs/common";
import {AuthService} from '@use-cases/auth/auth.service'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from '@presentation/controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
  })],
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule {}