import {
  ORGANIZATION_SERVICE_SYMBOL,
  JOBS_SERVICE_SYMBOL,
} from '@common/constants';
import { Module } from '@nestjs/common';
import { JobController } from '@presentation/controllers';
import { OrganizationsService } from '@use-cases/organization/organization.service';
import { JobService } from '@use-cases/job/job.service';

@Module({
  controllers: [JobController],
  providers: [
    {
      provide: JOBS_SERVICE_SYMBOL,
      useClass: JobService,
    },
    {
      provide: ORGANIZATION_SERVICE_SYMBOL,
      useClass: OrganizationsService,
    },
  ],
})
export class PracticeModule {}
