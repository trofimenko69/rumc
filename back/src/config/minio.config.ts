import type { MinioOptions } from '@infrastructure/minio/minio-options.interface';
import { ConfigService } from '@nestjs/config';

export function getMinioConfig(configService: ConfigService): MinioOptions {
  return {
    port: parseInt(configService.getOrThrow<string>('MINIO_PORT')),
    accessKey: configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
    endPoint: configService.getOrThrow<string>('MINIO_ENDPOINT'),
    secretKey: configService.getOrThrow<string>('MINIO_SECRET_KEY'),
    useSSL: Boolean(configService.getOrThrow<boolean>('MINIO_USE_SSL')),
  };
}
