import { ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IOrganizationService } from '@use-cases/organization/organization.service.interface';
import { ICompetenceService } from './competence.service.interfece';
import { CreateCompetenceDto, UpdateCompetenceDto } from '@presentation/dto/competence.dto';
import { Competence, Nosology } from '@prisma/client';

@Injectable()
export class CompetenceService implements ICompetenceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ORGANIZATION_SERVICE_SYMBOL)
    private readonly organizationService: IOrganizationService,
  ) {}

  async create(data: CreateCompetenceDto, organizationId: string) {

    const organization =
      await this.organizationService.findById(organizationId);

    if (!organization) {
      throw new BadRequestException('Организация не найдена');
    }

    const nosologies = await this.prisma.nosology.findMany({
      where: {
        id: { in : data.nosologiesId }
      }
    })

    if(nosologies.length !== data.nosologiesId.length) {
      throw new BadRequestException('Нозологии не существует')
    }


    const competence: any = await this.prisma.competence.create({
      data: {
        fileid: data.fileid,
        profession: data.profession,
        address: data.address,
        capacity: data.capacity,
        organizationId,
      },
    });


    await this.prisma.competenceNosology.createMany({
      data: nosologies.map((nosology: Nosology) => ({
        competenceId: competence.id,
        nosologyId: nosology.id,
      })),
    });

    return competence
  }

  async findAllByOrganization(organizationId: string) {
    return this.prisma.competence.findMany({
      where: {
        organizationId,
      },
    });
  }

  async findAll() {
    return this.prisma.competence.findMany({
      select: {
        id: true,
        fileid: true,
        profession: true,
        address: true,
        organization: {
          select: {
            fullName: true,
            shortName: true,
          },
        },
      },
    });

  }

    async findById(id: string) {
    try {
      const competence = await this.prisma.competence.findUnique({
        where: { id },
      });

      if (!competence) {
        throw new BadRequestException('Компетенция не найдена');
      }

      return competence;
    } catch (error) {
      throw new BadRequestException('Ошибка при поиске компетенции');
    }
  }

  async update(id: string, data: UpdateCompetenceDto) {
    await this.findById(id);

    return this.prisma.competence.update({
      where: { id },
      data: {
        fileid: data.fileid,
        profession: data.profession,
        address: data.address,
        capacity: data.capacity,
      }
    });

  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.competence.delete({
      where: { id },
    });
  }

}
