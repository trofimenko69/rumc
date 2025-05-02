import { GRADUATE_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { GraduatesController } from '@presentation/controllers';
import { GraduatesService } from '@use-cases/graduate/graduate.service';

@Module({
  controllers: [GraduatesController],
  providers: [
    {
      provide: GRADUATE_SERVICE_SYMBOL,
      useClass: GraduatesService,
    },
  ],
})
export class GraduatesModule {}
