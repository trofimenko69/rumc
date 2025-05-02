import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { File, User } from '@prisma/client';
import { Client } from 'minio';
import { MINIO_OPTIONS, MinioOptions } from './minio-options.interface';

@Injectable()
export class MinioService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly client: Client;

  constructor(@Inject(MINIO_OPTIONS) private readonly options: MinioOptions) {
    this.logger = new Logger(MinioService.name);
    this.logger.log(typeof this.options.useSSL);
    this.client = new Client({
      endPoint: this.options.endPoint,
      port: this.options.port,
      useSSL: false,
      accessKey: this.options.accessKey,
      secretKey: this.options.secretKey,
    });
  }

  async onModuleInit() {
    this.logger.log('MinioService initialized');
  }

  async onModuleDestroy() {
    this.logger.log('MinioService destroyed');
  }

  async createBucket(bucketName: User['id']) {
    return await this.client.makeBucket(bucketName, 'us-east-1');
  }

  async uploadFile(
    bucketName: User['id'],
    fileId: File['id'],
    file: Express.Multer.File,
  ) {
    return await this.client.putObject(bucketName, fileId, file.buffer);
  }

  async deleteFile(bucketName: User['id'], fileId: File['id']) {
    await this.getFile(bucketName, fileId);
    return await this.client.removeObject(bucketName, fileId);
  }

  async getFile(bucketName: User['id'], fileId: File['id']) {
    const file = await this.client.getObject(bucketName, fileId);

    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    return file;
  }
}
