import { Module } from '@nestjs/common';
import { ApplicantsController } from '@presentation/controllers';
import { ApplicantsService } from '@use-cases/applicants';

@Module({
  controllers: [ApplicantsController],
  providers: [
    {
      provide: 'applicantsService',
      useClass: ApplicantsService,
    },
  ],
})
export class ApplicantsModule {}
