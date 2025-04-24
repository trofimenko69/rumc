import { PrismaService } from '@infrastructure/db/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicantInfo, Prisma, User } from '@prisma/client';
import { IApplicantsService } from './applicants.service.interface';

@Injectable()
export class ApplicantsService implements IApplicantsService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplicant(
    applicant: Prisma.ApplicantInfoCreateInput,
    email: User['email'],
  ): Promise<ApplicantInfo> {
    const existingUser = await this.getApplicantByEmail(email);

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    return await this.prisma.applicantInfo.create({
      data: applicant,
    });
  }

  async getApplicants(): Promise<ApplicantInfo[]> {
    return await this.prisma.applicantInfo.findMany();
  }

  async getApplicantById(id: User['id']): Promise<ApplicantInfo> {
    const applicant = await this.prisma.applicantInfo.findUnique({
      where: { userId: id },
    });

    if (!applicant) {
      throw new NotFoundException('Абитуриент не найден');
    }

    return applicant;
  }

  async getApplicantByEmail(email: User['email']): Promise<ApplicantInfo> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Абитуриент не найден');
    }

    const applicant = await this.prisma.applicantInfo.findUnique({
      where: { userId: user.id },
    });

    if (!applicant) {
      throw new NotFoundException('Абитуриент не найден');
    }

    return applicant;
  }

  async updateApplicant(
    id: User['id'],
    applicant: Prisma.ApplicantInfoUpdateInput,
  ): Promise<ApplicantInfo> {
    await this.getApplicantById(id);
    return await this.prisma.applicantInfo.update({
      where: { userId: id },
      data: applicant,
    });
  }

  async deleteApplicant(id: User['id']): Promise<void> {
    await this.getApplicantById(id);
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
