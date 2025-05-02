import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class OrganizationDto {
  @ApiProperty({ description: 'Идентификатор организации' })
  @IsNotEmpty({ message: 'Поле id не должно быть пустым' })
  @IsString({ message: 'Поле id должно быть строкой' })
  id: string;
}

export class CreatePracticeDto {
  @ApiProperty({ description: 'Название практики' })
  @IsNotEmpty({ message: 'Поле name не должно быть пустым' })
  @IsString({ message: 'Поле name должно быть строкой' })
  name: string;

  @ApiProperty({ description: 'Тип практики' })
  @IsNotEmpty({ message: 'Поле type не должно быть пустым' })
  @IsString({ message: 'Поле type должно быть строкой' })
  type: string;

  @ApiProperty({ description: 'Город практики' })
  @IsNotEmpty({ message: 'Поле city не должно быть пустым' })
  @IsString({ message: 'Поле city должно быть строкой' })
  city: string;

  @ApiProperty({
    type: () => OrganizationDto,
    description: 'Организация, связанная с практикой',
  })
  @IsNotEmpty({ message: 'Поле organization не должно быть пустым' })
  @ValidateNested({
    message: 'Поле organization должно быть объектом OrganizationDto',
  })
  @Type(() => OrganizationDto)
  organization: OrganizationDto;

  constructor(partial: Partial<CreatePracticeDto>) {
    Object.assign(this, partial);
  }
}

export class UpdatePracticeDto {
  @ApiProperty({ description: 'Название практики' })
  @IsNotEmpty({ message: 'Поле name не должно быть пустым' })
  @IsString({ message: 'Поле name должно быть строкой' })
  name: string;

  @ApiProperty({ description: 'Тип практики' })
  @IsNotEmpty({ message: 'Поле type не должно быть пустым' })
  @IsString({ message: 'Поле type должно быть строкой' })
  type: string;

  @ApiProperty({ description: 'Город практики' })
  @IsNotEmpty({ message: 'Поле city не должно быть пустым' })
  @IsString({ message: 'Поле city должно быть строкой' })
  city: string;

  @ApiProperty({
    type: () => OrganizationDto,
    description: 'Организация, связанная с практикой',
  })
  @IsNotEmpty({ message: 'Поле organization не должно быть пустым' })
  @ValidateNested({
    message: 'Поле organization должно быть объектом OrganizationDto',
  })
  @Type(() => OrganizationDto)
  organization: OrganizationDto;

  constructor(partial: Partial<UpdatePracticeDto>) {
    Object.assign(this, partial);
  }
}
