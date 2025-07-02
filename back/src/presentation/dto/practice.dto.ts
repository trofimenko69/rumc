import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateNosologyDto } from '@presentation/dto/nosology.dto';

class OrganizationDto {
  @ApiProperty({ description: 'Идентификатор организации' })
  @IsNotEmpty({ message: 'Поле id не должно быть пустым' })
  @IsString({ message: 'Поле id должно быть строкой' })
  id: string;
}

export class CreatePracticeDto {

  @ApiProperty({ description: 'Тип практики' })
  @IsNotEmpty({ message: 'Поле type не должно быть пустым' })
  @IsString({ message: 'Поле type должно быть строкой' })
  type: string;

  @ApiProperty({ description: 'Дата начала практики' })
  @IsNotEmpty({ message: 'Поле beginDate не должно быть пустым' })
  @Type(() => Date)
  @IsDate({ message: 'Поле beginDate должно быть датой' })
  beginDate: Date;

  @ApiProperty({ description: 'Дата конца практики' })
  @IsNotEmpty({ message: 'Поле endDate не должно быть пустым' })
  @Type(() => Date)
  @IsDate({ message: 'Поле endDate должно быть датой' })
  endDate: Date;


  @ApiProperty({ description: 'Количество дней которое длится практика' })
  @IsNotEmpty({ message: 'Поле days не должно быть пустым' })
  @IsNumber()
  days: number;

  @ApiProperty({ description: 'id группы для которой назначается практика' })
  @IsNotEmpty({ message: 'Поле groupId не должно быть пустым' })
  @IsString({ message: 'Поле groupId должно быть строкой' })
  @IsUUID('all', { message: 'Поле groupId должно быть корректным UUID' })
  groupId: string;

  constructor(partial: Partial<CreatePracticeDto>) {
    Object.assign(this, partial);
  }
}

export class UpdatePracticeDto {

  @ApiProperty({ description: 'Тип практики' })
  @IsNotEmpty({ message: 'Поле type не должно быть пустым' })
  @IsOptional()
  @IsString({ message: 'Поле type должно быть строкой' })
  type: string;

  @ApiProperty({ description: 'Дата начала практики' })
  @IsNotEmpty({ message: 'Поле beginDate не должно быть пустым' })
  @IsOptional()
  @IsDate({ message: 'Поле beginDate должно быть датой' })
  beginDate: Date;

  @ApiProperty({ description: 'Дата конца практики' })
  @IsNotEmpty({ message: 'Поле endDate не должно быть пустым' })
  @IsOptional()
  @IsDate({ message: 'Поле endDate должно быть датой' })
  endDate: Date;


  @ApiProperty({ description: 'Количество дней которое длится практика' })
  @IsNotEmpty({ message: 'Поле days не должно быть пустым' })
  @IsOptional()
  @IsNumber()
  days: number;

  @ApiProperty({ description: 'id группы для которой назначается практика' })
  @IsNotEmpty({ message: 'Поле groupId не должно быть пустым' })
  @IsOptional({message: 'Поле groupId не обязательно'})
  @IsString({ message: 'Поле groupId должно быть строкой' })
  @IsUUID('all', { message: 'Поле groupId должно быть корректным UUID' })
  groupId: string;


  constructor(partial: Partial<UpdatePracticeDto>) {
    Object.assign(this, partial);
  }
}
