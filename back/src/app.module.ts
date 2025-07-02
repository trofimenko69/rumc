import { AUTH_SERVICE_SYMBOL, TOKENS_SERVICE_SYMBOL, USER_SERVICE_SYMBOL } from '@common/constants';
import { PrismaModule } from '@infrastructure/db/prisma.module';
import { JwtAuthGuard } from '@infrastructure/guard/jwt.guard';
import { MinioModule } from '@infrastructure/minio/minio.module';
import {
  ApplicantsModule,
  AuthModule,
  FilesModule,
  GraduatesModule,
  OrganizationsModule,
  PracticeModule,
  StudentsModule,
  TokensModule,
  AgreementModule,
  CompetenceModule,

} from '@nest/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from '@use-cases/tokens/tokens.service';
import { getJwtConfig } from './config/jwt.config';
import { getMinioConfig } from './config/minio.config';
import { AuthService } from '@use-cases/auth/auth.service';
import { UserService } from '@use-cases/user/user.service';
import { ITokensService } from '@use-cases/tokens/tokens.service.interface';
import { IAuthService } from '@use-cases/auth/auth.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    MinioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMinioConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    FilesModule,
    ApplicantsModule,
    AuthModule,
    TokensModule,
    StudentsModule,
    GraduatesModule,
    OrganizationsModule,
    PracticeModule,
    AgreementModule,
    CompetenceModule
  ],
  providers: [
    {
      provide: USER_SERVICE_SYMBOL,
      useClass: UserService,
    },
    {
      provide: TOKENS_SERVICE_SYMBOL,
      useClass: TokensService,
    },
    {
      provide: AUTH_SERVICE_SYMBOL,
      useClass: AuthService,
    },
    {
      provide: APP_GUARD,
      useFactory: (
        reflector: Reflector,
        tokensService: ITokensService,
        authService: IAuthService,
      ) => new JwtAuthGuard(reflector, tokensService, authService),
      inject: [Reflector, TOKENS_SERVICE_SYMBOL, AUTH_SERVICE_SYMBOL],
    },
  ],
})
export class AppModule {}
