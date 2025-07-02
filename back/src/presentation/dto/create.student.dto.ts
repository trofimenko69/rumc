import { ApiProperty } from '@nestjs/swagger';
import {  IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Подразделение студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  subdivision?: string;


  @ApiProperty({
    description: 'Специальность студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiProperty({
    description: 'Основные профессии студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainProfessions?: string[];

  @ApiProperty({
    description: 'Дополнительные профессии студента',
    required: false,
  })
  @IsOptional()
  @IsString()
  extraProfessions?: string[];



  @ApiProperty({
    description: 'id группы студента',
    required: true,
  })
  @IsString()
  groupId?: string;
}
