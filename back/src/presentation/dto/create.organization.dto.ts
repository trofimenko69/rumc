import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto
  implements Omit<Prisma.OrganizationCreateInput, 'user'>
{
  @ApiProperty({
    description: 'Краткое название организации',
    example: 'ООО Ромашка',
  })
  @IsNotEmpty()
  @IsString()
  shortName: string;

  @ApiProperty({
    description: 'Полное название организации',
    example: 'Общество с ограниченной ответственностью Ромашка',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Описание организации',
    required: false,
    example: 'Компания, занимающаяся разработкой ПО.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Веб-сайт организации',
    required: false,
    example: 'https://example.com',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    description: 'Адрес организации',
    required: false,
    example: 'г. Москва, ул. Ленина, д. 1',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'ИНН организации',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  inn: string;

  @ApiProperty({
    description: 'КПП организации',
    example: '987654321',
  })
  @IsNotEmpty()
  @IsString()
  kpp: string;

  @ApiProperty({
    description: 'Имя представителя организации',
    example: 'Иван Иванов',
  })
  @IsNotEmpty()
  @IsString()
  representativeName: string;

  @ApiProperty({
    description: 'Должность представителя',
    example: 'Генеральный директор',
  })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({
    description: 'Телефон организации',
    example: '+7 (999) 123-45-67',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Электронная почта организации',
    example: 'info@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Социальные ссылки в формате JSON',
    required: false,
    type: Object,
    example: { facebook: 'fb.com/example', twitter: 'twitter.com/example' },
  })
  @IsOptional()
  socialLinks?: Record<string, any>;

  @ApiProperty({
    description: 'URL документа',
    required: false,
    example: 'https://example.com/document.pdf',
  })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @ApiProperty({
    description: 'Статус подтверждения',
    required: false,
    example: true,
  })
  @IsOptional()
  isConfirm?: boolean;

  @ApiProperty({
    description: 'Практики, связанные с организацией',
    required: false,
    type: 'array',
    example: [{ id: 1, name: 'Практика 1' }],
  })
  @IsOptional()
  practices?: Prisma.PracticeCreateNestedManyWithoutOrganizationInput;

  @ApiProperty({
    description: 'Вакансии, связанные с организацией',
    required: false,
    type: 'array',
    example: [{ id: 1, title: 'Разработчик' }],
  })
  @IsOptional()
  jobs?: Prisma.JobCreateNestedManyWithoutOrganizationInput;

  @ApiProperty({
    description: 'Отзывы, связанные с организацией',
    required: false,
    type: 'array',
    example: [{ id: 1, content: 'Отличная компания!' }],
  })
  @IsOptional()
  reviews?: Prisma.ReviewCreateNestedManyWithoutToOrganizationInput;
}
