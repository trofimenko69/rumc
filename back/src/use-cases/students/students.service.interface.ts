import { Prisma, StudentInfo } from '@prisma/client';

export interface IStudentService {
  create(
    data: Omit<Prisma.StudentInfoCreateInput, 'user'>,
    id: string,
  ): Promise<StudentInfo>;
  findById(id: string): Promise<StudentInfo>;
  findByEmail(email: string): Promise<StudentInfo>;
  getStudents(): Promise<StudentInfo[]>;
  delete(id: string): Promise<void>;
}
