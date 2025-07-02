import { ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IOrganizationService } from '@use-cases/organization/organization.service.interface';
import { IJobService } from './job.service.interface';
import { CreateJobDto, UpdateJobDto } from '@presentation/dto/job.dto';

@Injectable()
export class JobService implements IJobService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ORGANIZATION_SERVICE_SYMBOL)
    private readonly organizationService: IOrganizationService,
  ) {}

  async create(data: CreateJobDto, organizationId: string) {
    const organization =
      await this.organizationService.findById(organizationId);

    if (!organization) {
      throw new BadRequestException('Организация не найдена');
    }


    const job: any  = await this.prisma.job.create({
      data: {
        title: data.title,
        experience: data.experience,
        salary: data.salary,
        format: data.format,
        city: data.city,
        description: data.description,
        profession: data.profession,
        organizationId,
      },
    });

    const existingNosologies = await this.prisma.nosology.findMany({
      where: {
        name: {
          in: data.nosologies.map(d => d.name),
        },
      },
    });



    await this.prisma.jobNosology.createMany({
      data: existingNosologies.map(n => ({
        nosologyId: n.id,
        jobId: job.id,
      })),
      skipDuplicates: true,
    });

    return job
  }

  async findAll(organizationId: string) {
    return this.prisma.job.findMany({
      where: {
        organizationId,
      },
    });

  }
  async findById(id: string) {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id },
      });

      if (!job) {
        throw new BadRequestException('Вакансия не найдена');
      }

      return job;
    } catch (error) {
      throw new BadRequestException('Ошибка при поиске вакансии');
    }
  }

  async update(id: string, data: UpdateJobDto) {
    const practice = await this.findById(id);

    if (!practice) {
      throw new BadRequestException('Практика не найдена');
    }
    return this.prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        experience: data.experience,
        salary: data.salary,
        format: data.format,
        city: data.city,
        description: data.description,
        profession: data.profession,
      }
    });

  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.job.delete({
      where: { id },
    });
  }

}
