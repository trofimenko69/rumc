import { GRADUATE_SERVICE_SYMBOL } from '@common/constants';
import { forwardRef, Module } from '@nestjs/common';
import { GraduatesController } from '@presentation/controllers';
import { GraduatesService } from '@use-cases/graduate/graduate.service';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [GraduatesController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: GRADUATE_SERVICE_SYMBOL,
      useClass: GraduatesService,
    },
  ],
})
export class GraduatesModule {}
