import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { File, User } from 'prisma/generated';

@Injectable()
export class MinioService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(MinioService.name);
    this.client = new Client({
      endPoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      port: parseInt(this.configService.getOrThrow<string>('MINIO_PORT')),
      useSSL: this.configService.getOrThrow<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
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
