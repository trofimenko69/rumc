import { ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { OrganizationsController } from '@presentation/controllers';
import { OrganizationsService } from '@use-cases/organization/organization.service';

@Module({
  controllers: [OrganizationsController],
  providers: [
    {
      provide: ORGANIZATION_SERVICE_SYMBOL,
      useClass: OrganizationsService,
    },
  ],
})
export class OrganizationsModule {}
