import {
  ORGANIZATION_SERVICE_SYMBOL,
  COMPETENCE_SERVICE_SYMBOL,
} from '@common/constants';
import { forwardRef, Module } from '@nestjs/common';
import { CompetenceController } from '@presentation/controllers';
import { OrganizationsService } from '@use-cases/organization/organization.service';
import { CompetenceService } from '@use-cases/competence/competence.service';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [CompetenceController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: COMPETENCE_SERVICE_SYMBOL,
      useClass: CompetenceService,
    },
    {
      provide: ORGANIZATION_SERVICE_SYMBOL,
      useClass: OrganizationsService,
    },
  ],
})
export class CompetenceModule {}
