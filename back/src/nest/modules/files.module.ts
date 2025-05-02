import { FILES_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { FilesController } from '@presentation/controllers';
import { FilesService } from '@use-cases/files';

@Module({
  controllers: [FilesController],
  providers: [
    {
      provide: FILES_SERVICE_SYMBOL,
      useClass: FilesService,
    },
  ],
})
export class FilesModule {}
