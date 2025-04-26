import { Auth } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { IFilesService } from '@use-cases/files';
import { Response } from 'express';

@Controller('files/')
export class FilesController {
  constructor(
    @Inject('filesService') private readonly filesService: IFilesService,
  ) {}

  @Auth()
  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Файл успешно загружен' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiOperation({ summary: 'Загрузка файла' })
  async uploadFile(
    @CurrentUser('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.filesService.uploadFile(id, file);
  }

  @Auth()
  @Delete(':fileId')
  @ApiParam({
    name: 'fileId',
    type: String,
    description: 'File ID',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Файл успешно удален' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  @ApiOperation({ summary: 'Удаление файла' })
  async deleteFile(
    @CurrentUser('id') id: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    return await this.filesService.deleteFile(id, fileId);
  }

  @Auth()
  @Get(':fileId')
  @ApiParam({
    name: 'fileId',
    type: String,
    description: 'File ID',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Файл успешно получен' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  @ApiOperation({ summary: 'Получение файла по id' })
  async getFile(
    @CurrentUser('id') id: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { file, metadata } = await this.filesService.getFile(id, fileId);

    res.setHeader('Content-Type', metadata.type);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${metadata.name}"`,
    );

    file.pipe(res);
  }
}
