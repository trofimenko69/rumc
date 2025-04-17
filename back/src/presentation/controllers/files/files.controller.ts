import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { IFilesService } from '@use-cases/files';
import { Response } from 'express';

@Controller('files/:userId')
export class FilesController {
  constructor(
    @Inject('filesService') private readonly filesService: IFilesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл в формате JPG, PNG или GIF',
        },
      },
    },
  })
  async uploadFile(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.filesService.uploadFile(userId, file);
  }

  @Delete(':fileId')
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID',
  })
  @ApiParam({
    name: 'fileId',
    type: String,
    description: 'File ID',
  })
  async deleteFile(
    @Param('userId') userId: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    return await this.filesService.deleteFile(userId, fileId);
  }

  @Get(':fileId')
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID',
  })
  @ApiParam({
    name: 'fileId',
    type: String,
    description: 'File ID',
  })
  async getFile(
    @Param('userId') userId: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { file, metadata } = await this.filesService.getFile(userId, fileId);

    res.setHeader('Content-Type', metadata.type);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${metadata.name}"`,
    );

    file.pipe(res);
  }
}
