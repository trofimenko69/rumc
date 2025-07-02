import {
  ORGANIZATION_SERVICE_SYMBOL,
  PRACTICE_SERVICE_SYMBOL,
  AGREEMENTS_SERVICE_SYMBOL, JOBS_SERVICE_SYMBOL,
} from '@common/constants';
import { AgreementState } from '@common/utils/agreement.state';
import { forwardRef, Module } from '@nestjs/common';
import { AgreementsController } from '@presentation/controllers';
import { OrganizationsService } from '@use-cases/organization/organization.service';
import { PracticeService } from '@use-cases/practice/practice.service';
import { JobService } from '@use-cases/job/job.service';
import {AgreementService} from '@use-cases/agreements/agreement.service';
import { PracticeState } from '@common/utils/practice.state-machine';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [AgreementsController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: AGREEMENTS_SERVICE_SYMBOL,
      useClass: AgreementService,

    },
    {
      provide: ORGANIZATION_SERVICE_SYMBOL,
      useClass: OrganizationsService,
    },
    {
      provide: PRACTICE_SERVICE_SYMBOL,
      useClass: PracticeService,
    },

    {
      provide: JOBS_SERVICE_SYMBOL,
      useClass: JobService,
    },
    AgreementState,
    PracticeState
  ],
})
export class AgreementModule {}
