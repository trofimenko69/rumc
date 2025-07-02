import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, ValidateNested } from 'class-validator';

class PracticeDto {
  @ApiProperty({ description: 'Идентификатор практики' })
  @IsNotEmpty({ message: 'Поле id не должно быть пустым' })
  @IsString({ message: 'Поле id должно быть строкой' })
  @IsUUID('all', { message: 'Поле id должно быть корректным UUID' })
  id: string;
}

class JobDto {
  @ApiProperty({ description: 'Идентификатор job' })
  @IsNotEmpty({ message: 'Поле id не должно быть пустым' })
  @IsString({ message: 'Поле id должно быть строкой' })
  @IsUUID('all', { message: 'Поле id должно быть корректным UUID' })
  id: string;
}

export class CreateAgreementDto {
  @ApiProperty({ description: 'id студента с которым заключено соглашение' })
  @IsNotEmpty({ message: 'Поле userId не должно быть пустым' })
  @IsString({ message: 'Поле userId должно быть строкой' })
  @IsOptional({ message: 'Поле userId не обязательное'})
  @IsUUID('all', { message: 'Поле userId должно быть корректным UUID' })
  userId: string;

  @ApiProperty({ description: 'goal' })
  @IsNotEmpty({ message: 'Поле goal не должно быть пустым' })
  @IsOptional({message: 'Поле goal не обязательно'})
  @IsString({ message: 'Поле goal должно быть строкой' })
  goal: string;

  @ApiProperty({ description: 'id практики на которое заключается соглашение' })
  @IsNotEmpty({ message: 'Поле practiceId не должно быть пустым' })
  @IsString({ message: 'Поле practiceId должно быть строкой' })
  @IsUUID('all', { message: 'Поле practiceId должно быть корректным UUID' })
  practiceId: string;


  @ApiProperty({ description: 'id компетенции в компании на которое заключается соглашение' })
  @IsNotEmpty({ message: 'Поле competenceId не должно быть пустым' })
  @IsString({ message: 'Поле competenceId должно быть строкой' })
  @IsUUID('all', { message: 'Поле competenceId должно быть корректным UUID' })
  competenceId: string;

  @ApiProperty({ description: 'id вакансии на которое заключается соглашение' })
  @IsNotEmpty({ message: 'Поле jobId не должно быть пустым' })
  @IsOptional({message: 'Поле jobId не обязательно'})
  @IsString({ message: 'Поле jobId должно быть строкой' })
  @IsUUID('all', { message: 'Поле jobId должно быть корректным UUID' })
  jobId: string;

  constructor(partial: Partial<CreateAgreementDto>) {
    Object.assign(this, partial);
  }
}


export class UpdateAgreementDto {

  @ApiProperty({ description: 'fio отвественного за практику от компании' })
  @IsNotEmpty({ message: 'Поле fio не должно быть пустым' })
  @IsString({ message: 'Поле fio должно быть строкой' })
  @IsOptional()
  fio: string;

  @ApiProperty({ description: 'fio отвественного за практику от компании' })
  @IsNotEmpty({ message: 'Поле fio не должно быть пустым' })
  @IsPhoneNumber('RU', {message: 'Телефон должен быть русского региона'})
  @IsOptional()
  phone: string;

  @ApiProperty({ description: 'appointment компании' })
  @IsNotEmpty({ message: 'Поле appointment не должно быть пустым' })
  @IsString( { message: 'Поле appointment должно быть строкой'})
  @IsOptional()
  appointment: string;

  @ApiProperty({ description: 'roomName компании' })
  @IsNotEmpty({ message: 'Поле roomName не должно быть пустым' })
  @IsString( { message: 'Поле roomName должно быть строкой'})
  @IsOptional()
  roomName: string;

  @ApiProperty({ description: 'roomAddress компании' })
  @IsNotEmpty({ message: 'Поле roomAddress не должно быть пустым' })
  @IsString( { message: 'Поле roomAddress должно быть строкой'})
  @IsOptional()
  roomAddress: string;

  @ApiProperty({ description: 'Список оборудования'})
  @IsNotEmpty({message: 'Поле equipmentList не должно быть пустым '})
  @IsString( { message: 'Поле equipmentList должно быть строкой'})
  @IsOptional()
  equipmentList: string;


  @ApiProperty({description: 'status'})
  @IsNotEmpty({message: 'Поле статус не должно быть пустым'})
  @IsEnum(Status, { message: 'Статус должен быть одним и Status' })
  @IsOptional()
  status: Status;


  constructor(partial: Partial<UpdateAgreementDto>) {
    Object.assign(this, partial);
  }
}


