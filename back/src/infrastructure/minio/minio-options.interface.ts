import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export const MINIO_OPTIONS = Symbol('MINIO_MODULE');

export type MinioOptions = {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
};

export type MinioAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<MinioOptions>, 'useFactory' | 'inject'>;
