import { DynamicModule, Module } from '@nestjs/common';
import {
  MINIO_OPTIONS,
  MinioAsyncOptions,
  type MinioOptions,
} from './minio-options.interface';
import { MinioService } from './minio.service';

@Module({})
export class MinioModule {
  static forRoot(options: MinioOptions): DynamicModule {
    return {
      module: MinioModule,
      providers: [
        {
          provide: MINIO_OPTIONS,
          useValue: options,
        },
        MinioService,
      ],
      exports: [MinioService],
      global: true,
    };
  }

  static forRootAsync(options: MinioAsyncOptions): DynamicModule {
    return {
      module: MinioModule,
      imports: [...(options.imports ?? [])],
      providers: [
        {
          provide: MINIO_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        MinioService,
      ],
      exports: [MinioService],
      global: true,
    };
  }
}
