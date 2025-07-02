
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty, IsArray,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString, IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNosologyDto } from './nosology.dto';

export class CreateCompetenceDto {
  @ApiProperty({ description: 'Область компетенции' })
  @IsNotEmpty({ message: 'Поле fileid не должно быть пустым' })
  @IsString({ message: 'Поле fileid должно быть строкой' })
  fileid: string;

  @ApiProperty({ description: 'Место' })
  @IsNotEmpty({ message: 'Поле fileid не должно быть пустым' })
  @IsString({ message: 'Поле address должно быть строкой' })
  address: string;

  @ApiProperty({ description: 'Количество мест' })
  @IsNotEmpty({ message: 'Поле capacity не должно быть пустым' })
  @IsNumber()
  capacity: number;

  @ApiProperty({ description: 'Профессия' })
  @IsNotEmpty({ message: 'Поле profession не должно быть пустым' })
  @IsString({ message: 'Поле profession должно быть строкой' })
  profession: string;

  @ApiProperty({ description: 'Профессия' })
  @IsArray({ message: 'Поле nosologiesId должно быть массивом' })
  @ArrayNotEmpty({ message: 'Массив nosologiesId не должен быть пустым' })
  @IsUUID('all', { each: true, message: 'Каждый элемент nosologiesId должен быть UUID' })
  nosologiesId: string [];

}


export class UpdateCompetenceDto {
  @ApiProperty({ description: 'Область компетенции' })
  @IsOptional()
  @IsString({ message: 'Поле fileid должно быть строкой' })
  fileid: string;

  @ApiProperty({ description: 'Место' })
  @IsOptional()
  @IsNotEmpty({ message: 'Поле address не должно быть пустым' })
  @IsString({ message: 'Поле address должно быть строкой' })
  address: string;

  @ApiProperty({ description: 'Количество мест', required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'Поле capacity не должно быть пустым' })
  @IsString({ message: 'Поле capacity должно быть числом' })
  capacity: number;

  @ApiProperty({ description: 'Профессия' })
  @IsOptional()
  @IsNotEmpty({ message: 'Поле profession не должно быть пустым' })
  @IsString({ message: 'Поле profession должно быть строкой' })
  profession: string;


  @ApiProperty({ description: 'Профессия' })
  @IsArray({ message: 'Поле nosologiesId должно быть массивом' })
  @IsOptional()
  @ArrayNotEmpty({ message: 'Массив nosologiesId не должен быть пустым' })
  @IsUUID('all', { each: true, message: 'Каждый элемент nosologiesId должен быть UUID' })
  nosologiesId: string [];


  constructor(partial: Partial<UpdateCompetenceDto>) {
    Object.assign(this, partial);
  }
}



