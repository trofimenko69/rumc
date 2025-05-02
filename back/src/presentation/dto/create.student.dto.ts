import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto
  implements Omit<Prisma.StudentInfoCreateInput, 'user'>
{
  @ApiProperty({
    description: 'Подразделение студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  subdivision?: string;

  @ApiProperty({
    description: 'Уровень образования студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  educationLevel?: string;

  @ApiProperty({
    description: 'Курс студента',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  course?: number;

  @ApiProperty({
    description: 'Форма обучения студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  educationForm?: string;

  @ApiProperty({
    description: 'Специальность студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiProperty({
    description: 'Кафедра студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: 'Группа студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  group?: string;
}
