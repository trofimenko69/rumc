import { PrismaService } from '@infrastructure/db/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, StudentInfo } from '@prisma/client';
import { IStudentService } from './students.service.interface';

export class StudentService implements IStudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<Prisma.StudentInfoCreateInput, 'user'>,
    id: string,
  ): Promise<StudentInfo> {
    const newStudent = await this.prisma.studentInfo.findUnique({
      where: {
        userId: id,
      },
    });

    if (newStudent) throw new ConflictException('Такой студент уже существует');

    return await this.prisma.studentInfo.create({
      data: {
        ...data,
        userId: id,
      },
    });
  }

  async findById(id: string): Promise<StudentInfo> {
    const student = await this.prisma.studentInfo.findUnique({
      where: {
        userId: id,
      },
    });

    if (!student) throw new NotFoundException('Студент не найден');

    return student;
  }

  async findByEmail(email: string): Promise<StudentInfo> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        studentInfo: true,
      },
    });

    if (!student.studentInfo) throw new NotFoundException('Студент не найден');

    return student.studentInfo;
  }

  async update(
    id: string,
    data: Prisma.StudentInfoUpdateInput,
  ): Promise<StudentInfo> {
    await this.findById(id);

    return await this.prisma.studentInfo.update({
      where: {
        userId: id,
      },
      data,
    });
  }

  async getStudents(): Promise<StudentInfo[]> {
    return await this.prisma.studentInfo.findMany();
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.studentInfo.delete({
      where: {
        userId: id,
      },
    });
  }
}
