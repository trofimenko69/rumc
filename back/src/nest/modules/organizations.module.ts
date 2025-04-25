import { Module } from '@nestjs/common';
import { OrganizationsController } from '@presentation/controllers';
import { OrganizationsService } from '@use-cases/organization/organization.service';

@Module({
  controllers: [OrganizationsController],
  providers: [
    {
      provide: 'organizationsService',
      useClass: OrganizationsService,
    },
  ],
})
export class OrganizationsModule {}
