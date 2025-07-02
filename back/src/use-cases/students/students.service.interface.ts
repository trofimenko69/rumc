import { StudentInfo } from '@prisma/client';
import { CreateStudentDto } from '@presentation/dto/create.student.dto';

export interface IStudentService {
  create(
    data: CreateStudentDto,
    id: string,
  ): Promise<StudentInfo>;
  findById(id: string): Promise<StudentInfo>;
  findByEmail(email: string): Promise<StudentInfo>;
  getStudents(): Promise<StudentInfo[]>;
  delete(id: string): Promise<void>;
  self(id: string): Promise<any>
}
