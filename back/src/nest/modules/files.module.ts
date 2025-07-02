import { FILES_SERVICE_SYMBOL } from '@common/constants';
import { forwardRef, Module } from '@nestjs/common';
import { FilesController } from '@presentation/controllers';
import { FilesService } from '@use-cases/files';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [FilesController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: FILES_SERVICE_SYMBOL,
      useClass: FilesService,
    },
  ],
})
export class FilesModule {}
