import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicantDto implements Prisma.ApplicantInfoCreateInput {
  @ApiProperty({
    description: 'Кафедра, к которой относится абитуриент',
    required: false,
    example: 'Кафедра информатики',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: 'Специализация абитуриента',
    required: false,
    example: 'Программная инженерия',
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({
    description: 'Пользователь, связанный с абитуриентом',
    required: true,
  })
  @IsNotEmpty()
  user: Prisma.UserCreateNestedOneWithoutApplicantInfoInput;
}
