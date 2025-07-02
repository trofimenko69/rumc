import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StudentInfo, Role, TypeAgreement } from '@prisma/client';
import { IStudentService } from './students.service.interface';
import { CreateStudentDto } from '@presentation/dto/create.student.dto';

@Injectable()
export class StudentService implements IStudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateStudentDto,
    id: string,
  ): Promise<StudentInfo> {
    const newStudent = await this.prisma.studentInfo.findUnique({
      where: {
        userId: id,
      },
    });

    if (newStudent) throw new ConflictException('Такой студент уже существует');

    await this.prisma.user.update({
      where: {
        id: id,
      },
        data: {
          role: Role.STUDENT,
        }
    })

    return this.prisma.studentInfo.create({
      data: {
        subdivision: data.subdivision,
        major: data.major,
        mainProfessions: data.mainProfessions,
        extraProfessions: data.extraProfessions,
        groupId: data.groupId,
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

  async self(id:string){
    const student = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        studentInfo: {
          include: {
            group: {
              select:{
                name: true,
                course: true,
                educationForm: true,
                educationLevel: true,
                specialityId: true,
                speciality: {
                  select: {
                    name: true,
                    specialtyInDepartment: {
                      select: {
                        department: {
                          select: {
                            name: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      }
    })

      if(!student) {
        throw new BadRequestException('Студент не найден')
      }

          const [practices , jobs] = await Promise.all([
          this.prisma.practice.findMany({
            where: {
              groupId: student.studentInfo.groupId
            },
            include: {
              competenceInPractice: {
                where: {
                  studentId: student.studentInfo.id,
                },
                select: {
                  agreements: {
                    select: {
                      status: true
                    },
                  },
                  competence: {
                    select: {
                      fileid: true,
                      profession: true,
                      address: true,
                      organization: {
                        select: {
                         shortName: true
                        }
                      }
                    }
                  }
                }

              },
            },
            orderBy: [
              { beginDate: 'asc' },
            ],
          }),
          this.prisma.agreement.findMany({
            where: {
              userId: id,
              type: TypeAgreement.JOB
            },
            include: {
              job: true,
            },
          }),
        ]);


      return {
        student: {
            email: student.email,
            fullName: student.fullName,
            phone: student.phone,
            parents: student.parents,
            mainProfessions: student.studentInfo.mainProfessions,
            extraProfessions: student.studentInfo.extraProfessions,
            studyInfo: {
              ...student.studentInfo.group,
            }
        },
        practice:practices.map(p=>({
          id: p.id,
          type: p.type,
          beginDate: p?.beginDate,
          endDate: p?.endDate,
          status: p?.competenceInPractice[0]?.agreements[0].status,
          fileid: p?.competenceInPractice[0]?.competence.fileid,
          profession: p?.competenceInPractice[0]?.competence.profession,
          address: p?.competenceInPractice[0]?.competence.address,
          organization: p?.competenceInPractice[0]?.competence.organization.shortName,
        })), jobs
      };
  }


  async update(
    id: string,
    data: Prisma.StudentInfoUpdateInput,
  ): Promise<StudentInfo> {
    await this.findById(id);

    return this.prisma.studentInfo.update({
      where: {
        userId: id,
      },
      data,
    });
  }

  async getStudents(): Promise<StudentInfo[]> {
    return this.prisma.studentInfo.findMany();
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
