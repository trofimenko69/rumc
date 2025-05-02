import { APPLICANTS_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { ApplicantsController } from '@presentation/controllers';
import { ApplicantsService } from '@use-cases/applicants';

@Module({
  controllers: [ApplicantsController],
  providers: [
    {
      provide: APPLICANTS_SERVICE_SYMBOL,
      useClass: ApplicantsService,
    },
  ],
})
export class ApplicantsModule {}
