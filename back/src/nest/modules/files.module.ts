import { Module } from '@nestjs/common';
import { FilesController } from '@presentation/controllers';
import { FilesService } from '@use-cases/files';

@Module({
  controllers: [FilesController],
  providers: [
    {
      provide: 'filesService',
      useClass: FilesService,
    },
  ],
})
export class FilesModule {}
