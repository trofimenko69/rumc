import { PrismaModule } from '@infrastructure/db/prisma.module';
import { JwtAuthGuard } from '@infrastructure/guard/jwt.guard';
import { MinioModule } from '@infrastructure/minio/minio.module';
import {
  ApplicantsModule,
  AuthModule,
  FilesModule,
  TokensModule,
} from '@nest/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from '@use-cases/tokens/tokens.service';
import { getJwtConfig } from './config/jwt.config';

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
    PrismaModule,
    MinioModule,
    FilesModule,
    ApplicantsModule,
    AuthModule,
    TokensModule,
  ],
  providers: [
    Reflector,
    {
      provide: 'tokensService',
      useClass: TokensService,
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector, tokensService: TokensService) =>
        new JwtAuthGuard(reflector, tokensService),
      inject: [Reflector, 'tokensService'],
    },
  ],
})
export class AppModule {}
