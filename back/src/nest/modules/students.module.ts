import { STUDENT_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { StudentsController } from '@presentation/controllers';
import { StudentService } from '@use-cases/students/student.service';

@Module({
  controllers: [StudentsController],
  providers: [
    {
      provide: STUDENT_SERVICE_SYMBOL,
      useClass: StudentService,
    },
  ],
})
export class StudentsModule {}
