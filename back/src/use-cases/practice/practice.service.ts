import { ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { PracticeState } from '@common/utils/practice.state-machine';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Practice, PracticeStatus } from '@prisma/client';
import { IOrganizationService } from '@use-cases/organization/organization.service.interface';
import { IPracticeService } from './practice.service.interface';
import { CreatePracticeDto, UpdatePracticeDto } from '@presentation/dto/practice.dto';

@Injectable()
export class PracticeService implements IPracticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly practiceState: PracticeState,
    @Inject(ORGANIZATION_SERVICE_SYMBOL)
    private readonly organizationService: IOrganizationService,
  ) {}

  async create(data: CreatePracticeDto) {

    const group = await this.prisma.group.findUnique({
      where: {
        id: data.groupId
      }
    })

    if(!group) {
      throw new BadRequestException('group does not exist');
    }

    const practice = await this.prisma.practice.create({
      data: {
        type: data.type,
        beginDate: data.beginDate,
        endDate: data.endDate,
        days: data.days,
        groupId: data.groupId
      },
    });


    return practice;
  }

  async findAll(){
    return this.prisma.practice.findMany({
      include: {
        group: true,
      },
      orderBy: {
        beginDate: 'asc',
      },
    } as const);
  }
  async findById(id: string): Promise<Practice> | undefined {
    try {
      const practice = await this.prisma.practice.findUnique({
        where: { id },
        include: {
          group: true,
        }
      });

      if (!practice) {
        throw new BadRequestException('Практика не найдена');
      }

      return practice;
    } catch (error) {
      throw new BadRequestException('Ошибка при поиске практики');
    }
  }

  async update(id: string, data: UpdatePracticeDto) {
    const practice = await this.findById(id);

    if (!practice) {
      throw new BadRequestException('Практика не найдена');
    }
    const updatedPractice = await this.prisma.practice.update({
      where: { id },
      data: {
        type: data.type,
        beginDate: data.beginDate,
        endDate: data.endDate,
        days: data.days
      },
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
