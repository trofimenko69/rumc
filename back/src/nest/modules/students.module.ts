import { Module } from '@nestjs/common';
import { StudentsController } from '@presentation/controllers';
import { StudentService } from '@use-cases/students/student.service';

@Module({
  controllers: [StudentsController],
  providers: [
    {
      provide: 'studentsService',
      useClass: StudentService,
    },
  ],
})
export class StudentsModule {}
