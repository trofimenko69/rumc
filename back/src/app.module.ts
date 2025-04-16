import { PrismaModule } from '@infrastructure/db/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
    }),
    PrismaModule,
  ],
})
export class AppModule {}
