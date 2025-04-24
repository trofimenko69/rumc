import { User } from '@prisma/client';
import Stream from 'stream';

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
}

export interface IFilesService {
  uploadFile(userId: User['id'], file: Express.Multer.File): Promise<string>;
  deleteFile(userId: User['id'], fileId: string): Promise<void>;
  getFile(
    userId: User['id'],
    fileId: string,
  ): Promise<{ file: Stream.Readable; metadata: FileMetadata }>;
}
