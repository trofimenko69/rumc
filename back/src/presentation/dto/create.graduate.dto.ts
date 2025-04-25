import { Prisma } from '@prisma/client';
import { IsArray, IsOptional } from 'class-validator';

export class CreateGraduateDto
  implements Omit<Prisma.GraduateInfoCreateInput, 'user'>
{
  @IsOptional()
  @IsArray()
  mainProfessions?: Prisma.GraduateInfoCreatemainProfessionsInput | string[];

  @IsOptional()
  @IsArray()
  extraProfessions?: string[] | Prisma.GraduateInfoCreateextraProfessionsInput;

  @IsOptional()
  jobs?: Prisma.JobCreateNestedManyWithoutGraduateInfoInput;

  @IsOptional()
  certificates?: Prisma.CertificateCreateNestedManyWithoutGraduateInfoInput;
}
