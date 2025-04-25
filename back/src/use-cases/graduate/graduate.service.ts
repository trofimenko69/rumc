import { PrismaService } from '@infrastructure/db/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { GraduateInfo, Prisma } from '@prisma/client';
import { IGraduateService } from './graduate.service.interface';

export class GraduatesService implements IGraduateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<Prisma.GraduateInfoCreateInput, 'user'>,
    id: string,
  ): Promise<GraduateInfo> {
    const newGraduate = await this.prisma.graduateInfo.findUnique({
      where: {
        userId: id,
      },
    });

    if (newGraduate)
      throw new ConflictException('Такой выпускник уже существует');

    return await this.prisma.graduateInfo.create({
      data: {
        ...data,
        userId: id,
      },
    });
  }

  async findById(id: string): Promise<GraduateInfo> {
    const graduate = await this.prisma.graduateInfo.findUnique({
      where: {
        userId: id,
      },
    });

    if (!graduate) throw new NotFoundException('Такой выпускник не найден');

    return graduate;
  }

  async findByEmail(email: string): Promise<GraduateInfo> {
    const graduate = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        graduateInfo: true,
      },
    });

    if (!graduate.graduateInfo)
      throw new NotFoundException('Такой выпускник не найден');

    return graduate.graduateInfo;
  }

  async update(
    id: string,
    data: Prisma.GraduateInfoUpdateInput,
  ): Promise<GraduateInfo> {
    await this.findById(id);
    return await this.prisma.graduateInfo.update({
      where: {
        userId: id,
      },
      data,
    });
  }

  async getGraduates(): Promise<GraduateInfo[]> {
    return await this.prisma.graduateInfo.findMany();
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.graduateInfo.delete({
      where: {
        userId: id,
      },
    });
  }
}
