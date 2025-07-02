import { ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { forwardRef, Module } from '@nestjs/common';
import { OrganizationsController } from '@presentation/controllers';
import { OrganizationsService } from '@use-cases/organization/organization.service';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [OrganizationsController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: ORGANIZATION_SERVICE_SYMBOL,
      useClass: OrganizationsService,
    },
  ],
})
export class OrganizationsModule {}
