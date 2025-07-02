import { APPLICANTS_SERVICE_SYMBOL } from '@common/constants';
import { forwardRef, Module } from '@nestjs/common';
import { ApplicantsController } from '@presentation/controllers';
import { ApplicantsService } from '@use-cases/applicants';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [ApplicantsController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: APPLICANTS_SERVICE_SYMBOL,
      useClass: ApplicantsService,
    },
  ],
})
export class ApplicantsModule {}
