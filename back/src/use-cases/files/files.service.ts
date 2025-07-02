import { PrismaService } from '@infrastructure/db/prisma.service';
import { MinioService } from '@infrastructure/minio/minio.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import Stream from 'stream';
import { FileMetadata, IFilesService } from './files.service.interface';

@Injectable()
export class FilesService implements IFilesService {
  constructor(
    private readonly minioService: MinioService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadFile(
    userId: User['id'],
    file: Express.Multer.File,
  ): Promise<string> {
    const newFile = await this.prisma.file.create({
      data: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      },
    });

    await this.minioService.uploadFile(userId, newFile.id, file);

    return newFile.id;
  }

  async deleteFile(userId: User['id'], fileId: string): Promise<void> {
    await this.minioService.deleteFile(userId, fileId);
    await this.prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  }

  async getFile(
    userId: User['id'],
    fileId: string,
  ): Promise<{ file: Stream.Readable; metadata: FileMetadata }> {
    const metadata = await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!metadata) {
      throw new NotFoundException('Файл не найден');
    }

    const file = await this.minioService.getFile(userId, fileId);

    return {
      file,
      metadata: {
        name: metadata.name,
        type: metadata.type,
        size: metadata.size,
      },
    };
  }
}
