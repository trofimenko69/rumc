import { STUDENT_SERVICE_SYMBOL } from '@common/constants';
import { forwardRef, Module } from '@nestjs/common';
import { StudentsController } from '@presentation/controllers';
import { StudentService } from '@use-cases/students/student.service';
import { AuthModule } from '@nest/modules/auth.module';

@Module({
  controllers: [StudentsController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    {
      provide: STUDENT_SERVICE_SYMBOL,
      useClass: StudentService,
    },
  ],
})
export class StudentsModule {}
