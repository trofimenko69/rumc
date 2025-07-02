import {
  ORGANIZATION_SERVICE_SYMBOL,
  PRACTICE_SERVICE_SYMBOL,
} from '@common/constants';
import { PracticeState } from '@common/utils/practice.state-machine';
import { forwardRef, Module } from '@nestjs/common';
import { PracticeController } from '@presentation/controllers';
import { OrganizationsService } from '@use-cases/organization/organization.service';
import { PracticeService } from '@use-cases/practice/practice.service';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [PracticeController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: PRACTICE_SERVICE_SYMBOL,
      useClass: PracticeService,
    },
    {
      provide: ORGANIZATION_SERVICE_SYMBOL,
      useClass: OrganizationsService,
    },
    PracticeState,
  ],
})
export class PracticeModule {}
