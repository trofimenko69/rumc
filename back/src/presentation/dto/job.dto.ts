
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNosologyDto } from './nosology.dto';

export class CreateJobDto {
  @ApiProperty({ description: 'Название вакансии' })
  @IsNotEmpty({ message: 'Поле title не должно быть пустым' })
  @IsString({ message: 'Поле title должно быть строкой' })
  title: string;

  @ApiProperty({ description: 'Опыт работы', required: false })
  @IsOptional()
  @IsString({ message: 'Поле experience должно быть строкой' })
  experience?: string;

  @ApiProperty({ description: 'Зарплата', required: false })
  @IsOptional()
  @IsString({ message: 'Поле salary должно быть строкой' })
  salary?: string;

  @ApiProperty({ description: 'Формат работы', required: false })
  @IsOptional()
  @IsString({ message: 'Поле format должно быть строкой' })
  format?: string;

  @ApiProperty({ description: 'Город' })
  @IsNotEmpty({ message: 'Поле city не должно быть пустым' })
  @IsString({ message: 'Поле city должно быть строкой' })
  city: string;

  @ApiProperty({ description: 'Профессия' })
  @IsNotEmpty({ message: 'Поле profession не должно быть пустым' })
  @IsString({ message: 'Поле profession должно быть строкой' })
  profession: string;

  @ApiProperty({ description: 'Описание', required: false })
  @IsOptional()
  @IsString({ message: 'Поле description должно быть строкой' })
  description?: string;

  @ApiProperty({
      type: () => [CreateNosologyDto],
      required: true,
      description: 'Нозологии, связанные с вакансией',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateNosologyDto)
  nosologies?: CreateNosologyDto[];

  constructor(partial: Partial<CreateJobDto>) {
    Object.assign(this, partial);
  }
}


export class UpdateJobDto {
  @ApiProperty({ description: 'Название вакансии', required: false })
  @IsOptional()
  @IsString({ message: 'Поле title должно быть строкой' })
  @IsNotEmpty({ message: 'Поле title не должно быть пустым' })
  title?: string;

  @ApiProperty({ description: 'Опыт работы', required: false })
  @IsOptional()
  @IsString({ message: 'Поле experience должно быть строкой' })
  @IsNotEmpty({ message: 'Поле experience не должно быть пустым' })
  experience?: string | null;

  @ApiProperty({ description: 'Зарплата', required: false })
  @IsOptional()
  @IsString({ message: 'Поле salary должно быть строкой' })
  @IsNotEmpty({ message: 'Поле salary не должно быть пустым' })
  salary?: string | null;

  @ApiProperty({ description: 'Формат работы', required: false })
  @IsOptional()
  @IsString({ message: 'Поле format должно быть строкой' })
  @IsNotEmpty({ message: 'Поле format не должно быть пустым' })
  format?: string | null;

  @ApiProperty({ description: 'Город', required: false })
  @IsOptional()
  @IsString({ message: 'Поле city должно быть строкой' })
  @IsNotEmpty({ message: 'Поле city не должно быть пустым' })
  city?: string;

  @ApiProperty({ description: 'Профессия', required: false })
  @IsOptional()
  @IsString({ message: 'Поле profession должно быть строкой' })
  @IsNotEmpty({ message: 'Поле profession не должно быть пустым' })
  profession?: string;

  @ApiProperty({ description: 'Описание', required: false })
  @IsOptional()
  @IsString({ message: 'Поле description должно быть строкой' })
  @IsNotEmpty({ message: 'Поле description не должно быть пустым' })
  description?: string | null;

  @ApiProperty({
    type: () => [CreateNosologyDto],
    required: false,
    description: 'Нозологии, связанные с вакансией',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateNosologyDto)
  nosologies?: CreateNosologyDto[];

  constructor(partial: Partial<UpdateJobDto>) {
    Object.assign(this, partial);
  }
}



