import { PrismaModule } from '@infrastructure/db/prisma.module';
import { MinioModule } from '@infrastructure/minio/minio.module';
import { ApplicantsModule, FilesModule } from '@nest/modules';
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
    MinioModule,
    FilesModule,
    ApplicantsModule,
  ],
})
export class AppModule {}
