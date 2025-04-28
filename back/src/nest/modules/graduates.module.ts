import { Module } from '@nestjs/common';
import { GraduatesController } from '@presentation/controllers';
import { GraduatesService } from '@use-cases/graduate/graduate.service';

@Module({
  controllers: [GraduatesController],
  providers: [
    {
      provide: 'graduatesService',
      useClass: GraduatesService,
    },
  ],
})
export class GraduatesModule {}
