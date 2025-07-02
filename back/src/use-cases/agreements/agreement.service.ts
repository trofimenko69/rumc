import { JOBS_SERVICE_SYMBOL, PRACTICE_SERVICE_SYMBOL } from '@common/constants';
import { AgreementState } from '@common/utils/agreement.state';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WHO, Status, TypeAgreement } from '@prisma/client';
import { IPracticeService } from '@use-cases/practice/practice.service.interface';
import { IAgreementService } from './agreement.service.interface';
import { CreateAgreementDto, UpdateAgreementDto } from '@presentation/dto/agreements.dto';
import { IJobService } from '@use-cases/job/job.service.interface';

@Injectable()
export class AgreementService implements IAgreementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agreementState: AgreementState,

    @Inject(PRACTICE_SERVICE_SYMBOL)
    private readonly practiceService: IPracticeService,

    @Inject(JOBS_SERVICE_SYMBOL)
    private readonly jobService: IJobService,
  ) {}

  private groupAgreements(agreements: any[], type: TypeAgreement) {
    const statusMap: Record<Status, string> = {
      IN_PROGRESS: 'in_progress',
      WAITING: 'in_progress',
      ACCEPTED: 'accepted',
      DOCUMENTS_DECLINED: 'declined',
      DOCUMENTS_ACCEPTED: 'document_accepted',
      DECLINED: 'declined',
      IGNORED: 'ignore'
    };

    return agreements.reduce((acc, agreement) => {
      const who = agreement.who;
      const rawStatus = agreement.status;
      const groupedStatus = statusMap[rawStatus] || rawStatus;

      if (!acc[who]) {
        acc[who] = {};
      }

      if (!acc[who][groupedStatus]) {
        acc[who][groupedStatus] = [];
      }


      if(type === TypeAgreement.PRACTICE) {
        acc[who][groupedStatus].push({
          id: agreement.id,
          goal: agreement.goal,
          fileid: agreement.competeneceInPractice.competence.fileid,
          profession: agreement.competeneceInPractice.competence.profession,
          address: agreement.competeneceInPractice.competence.address,
          organization: agreement.competeneceInPractice.competence.organization,
          type: agreement.competeneceInPractice.practice.type,
          beginDate: agreement.competeneceInPractice.practice.beginDate,
          endDate: agreement.competeneceInPractice.practice.endDate,
        });
      }

      if(type === TypeAgreement.JOB) {
        acc[who][groupedStatus].push({
          id: agreement.id,
          goal: agreement.goal,
          address: agreement.job.city,
          organization: agreement.job.organization.shortName,
          format: agreement.job.format,
          title: agreement.job.title,
          experience: agreement.job.experience,
          salary: agreement.job.salary,
        });
      }


      return acc;
    }, {});
  }



  async create(data: CreateAgreementDto,  userId: string | null) {

    if(data.practiceId){

      const practice = await this.practiceService.findById(data.practiceId);

      if (!practice) {
        throw new BadRequestException('Практики не существует');
      }

      const competence: any = await this.prisma.competence.findFirst({
        where: {
          id: data.competenceId,
        }
      });

      if (!competence) {
        throw new BadRequestException('Компетенции не существует');
      }

      const studentInfo: any = await this.prisma.studentInfo.findFirst({
        where: {
          userId: userId ? userId : data.userId,
          groupId: practice.groupId
        },
      });

      if (!studentInfo) {
        throw new BadRequestException('У студента нет этой практики');
      }


      const agreement = await this.prisma.agreement.findFirst({
        where: {
          userId: userId ?? data.userId,
          status: {
            in: [Status.DOCUMENTS_ACCEPTED, Status.ACCEPTED],
          },
          competeneceInPractice: {
            practice: {
              id: practice.id,
            },
          },
        },
        include: {
          competeneceInPractice: {
            include: {
              practice: true,
            },
          },
        },
      });

      if(agreement) {
        throw new BadRequestException('Студент уже на практике')
      }

      const competenceInPractice = await this.prisma.competenceInPractice.upsert({
        where: {
          competenceId_studentId_practiceId: {
            competenceId: competence.id,
            studentId: studentInfo.id,
            practiceId: practice.id,
          },
        },
        update: {},
        create: {
          competenceId: competence.id,
          studentId: studentInfo.id,
          practiceId: practice.id,
        },
      });



      const agreementInCompany= await this.prisma.agreement.findFirst({
        where: {
          userId: userId ? userId : data.userId,
          competeneceInPracticeId: competenceInPractice.id
        }
      })

      if(agreementInCompany) {
        return agreementInCompany
      }

      return this.prisma.agreement.create({
        data: {
          userId: userId ? userId : data.userId,
          goal: data.goal,
          status: Status.WAITING,
          type: TypeAgreement.PRACTICE,
          competeneceInPracticeId: competenceInPractice.id,
          who: userId ? WHO.USER : WHO.ORGANIZATION
        },
      });
    }

    const job=await this.jobService.findById(data.jobId)
    if(!job) {
      throw new BadRequestException('Вакансии не существует');
    }


    const agreementInCompany= await this.prisma.agreement.findFirst({
      where: {
        userId: userId ? userId : data.userId,
        jobId: job.id,
        status: {
          notIn: [Status.DECLINED, Status.DOCUMENTS_DECLINED]
        }
      }
    })

    if(agreementInCompany) {
      return agreementInCompany
    }

    return  this.prisma.agreement.create({
      data: {
        userId: data.userId,
        goal: data.goal,
        status: Status.WAITING,
        type: TypeAgreement.JOB,
        jobId: job.id,
        who: userId ? WHO.USER : WHO.ORGANIZATION
      }
    });

  }

  async findAll(id: string, typeAgreement: TypeAgreement) {
    const agreements = await this.prisma.agreement.findMany({
      where: {
        userId: id,
        type: typeAgreement,
      },
      include: typeAgreement === TypeAgreement.JOB ? { job: {
        select : {
          organization: true
        }
        } } : {
        competeneceInPractice: {
          select: {
            competence: {
              select: {
                fileid: true,
                profession: true,
                address: true,
                organization: {
                  select: {
                    fullName: true,
                    address: true
                  }
                }
              }
            },
            practice: {
              select: {
                type: true,
                beginDate: true,
                endDate: true,
              }
            },
          },
        },
      },
    });

    return this.groupAgreements(agreements, typeAgreement)
  }

  async findById(id: string)  {
      const agreement = await this.prisma.agreement.findUnique({
        where: { id },
        include: {
          agreementInfo: true
        }
      });

      if (!agreement) {
        throw new BadRequestException('Соглашение не найдено');
      }

      return agreement
  }

  async update(id: string, data: UpdateAgreementDto) {
    const agreement = await this.findById(id);

    if (!agreement) {
      throw new BadRequestException('Соглашение не найдено');
    }

    if(!agreement.agreementInfo) {
      await this.prisma.agreementInfo.create({
        data: {
          ...data,
          agreementId: agreement.id,
        },
      })
      return agreement
    }

    await this.prisma.agreementInfo.update({
      where: {
        agreementId: agreement.id,
      },
      data: {
        ...data,
      },
    });

    return agreement
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.agreement.delete({
      where: { id },
    });
  }

  async changeStatus(id: string, status: Status) {
    const agreement = await this.findById(id);

    if (!agreement) {
      throw new BadRequestException('Соглашение не найдено');
    }

    if (!this.agreementState.canTransition(agreement.status, status)) {
      throw new BadRequestException(
        `Невозможно изменить статус с ${agreement.status} на ${status}`,
      );
    }


  }
}
