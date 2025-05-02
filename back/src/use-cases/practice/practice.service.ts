import { ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { PracticeState } from '@common/utils/practice.state-machine';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PracticeStatus, Prisma } from '@prisma/client';
import { IOrganizationService } from '@use-cases/organization/organization.service.interface';
import { IPracticeService } from './practice.service.interface';

@Injectable()
export class PracticeService implements IPracticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly practiceState: PracticeState,
    @Inject(ORGANIZATION_SERVICE_SYMBOL)
    private readonly organizationService: IOrganizationService,
  ) {}

  async create(data: Prisma.PracticeCreateInput[], organizationId: string) {
    const organization =
      await this.organizationService.findById(organizationId);

    if (!organization) {
      throw new BadRequestException('Организация не найдена');
    }

    const practices = await this.prisma.practice.createMany({
      data: data.map((item) => ({
        type: item.type,
        city: item.city,
        professions: item.professions,
        availableFor: item.availableFor,
        description: item.description,
        organizationId,
      })),
    });

    return practices;
  }

  async findAll(organizationId: string) {
    const practices = await this.prisma.practice.findMany({
      where: {
        organizationId,
      },
    });

    return practices;
  }
  async findById(id: string) {
    try {
      const practice = await this.prisma.practice.findUnique({
        where: { id },
      });

      if (!practice) {
        throw new BadRequestException('Практика не найдена');
      }

      return practice;
    } catch (error) {
      throw new BadRequestException('Ошибка при поиске практики');
    }
  }

  async update(id: string, data: Prisma.PracticeUpdateInput) {
    const practice = await this.findById(id);

    if (!practice) {
      throw new BadRequestException('Практика не найдена');
    }
    const updatedPractice = await this.prisma.practice.update({
      where: { id },
      data,
    });

    return updatedPractice;
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.practice.delete({
      where: { id },
    });
  }

  async changeStatus(id: string, status: PracticeStatus) {
    const practice = await this.findById(id);

    if (!practice) {
      throw new BadRequestException('Практика не найдена');
    }

    if (!this.practiceState.canTransition(practice.status, status)) {
      throw new BadRequestException(
        `Невозможно изменить статус с ${practice.status} на ${status}`,
      );
    }

    return this.prisma.practice.update({
      where: { id },
      data: { status },
    });
  }
}
