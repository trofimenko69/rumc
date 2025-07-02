import { PrismaService } from '@infrastructure/db/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Organization, Prisma } from '@prisma/client';
import { IOrganizationService } from './organization.service.interface';

@Injectable()
export class OrganizationsService implements IOrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<Prisma.OrganizationCreateInput, 'user'>,
    id: string,
  ): Promise<Organization> {
    const newOrganization = await this.prisma.organization.findUnique({
      where: {
        inn: data.inn,
      },
    });

    if (newOrganization)
      throw new ConflictException('Такая организация уже создана');

    console.log(newOrganization);

    return await this.prisma.organization.create({
      data: {
        ...data,
        userId: id,
      },
    });
  }

  async findById(id: string): Promise<Organization> {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id,
      },
    });

    if (!organization) throw new NotFoundException('Организация не найдена');

    return organization;
  }

  async findByInn(inn: string): Promise<Organization> {
    const organization = await this.prisma.organization.findUnique({
      where: {
        inn,
      },
    });

    if (!organization) throw new NotFoundException('Организация не найдена');

    return organization;
  }

  async confirm(id: string): Promise<Organization> {
    await this.findById(id);
    return await this.update(id, { isConfirm: true });
  }

  async reject(id: string): Promise<void> {
    await this.findById(id);
    await this.delete(id);
  }

  async update(
    id: string,
    data: Prisma.OrganizationUpdateInput,
  ): Promise<Organization> {
    await this.findById(id);
    return this.prisma.organization.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.organization.delete({
      where: {
        id,
      },
    });
  }

  async findByUserId(id: string): Promise<Organization> {
    return this.prisma.organization.findFirst({
      where: {
        userId: id,
      }
    });
  }
}
