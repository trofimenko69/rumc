import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateGraduateDto
  implements Omit<Prisma.GraduateInfoCreateInput, 'user'>
{
  @ApiProperty({
    description: 'Основные профессии выпускника',
    required: false,
    type: [String],
    example: ['Программист', 'Аналитик'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mainProfessions?: string[];

  @ApiProperty({
    description: 'Дополнительные профессии выпускника',
    required: false,
    type: [String],
    example: ['Дизайнер', 'Тестировщик'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  extraProfessions?: string[];

  @ApiProperty({
    description: 'Работы, связанные с выпускником',
    required: false,
    type: 'array',
  })
  @IsOptional()
  jobs?: Prisma.JobCreateNestedManyWithoutGraduateInfoInput;

  @ApiProperty({
    description: 'Сертификаты выпускника',
    required: false,
    type: 'array',
  })
  @IsOptional()
  certificates?: Prisma.CertificateCreateNestedManyWithoutGraduateInfoInput;
}
