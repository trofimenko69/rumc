import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto
  implements Omit<Prisma.OrganizationCreateInput, 'user'>
{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shortName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  inn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  kpp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  representativeName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  socialLinks?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;

  @ApiProperty()
  @IsOptional()
  @IsString()
  documentUrl?: string;

  isConfirm?: boolean;

  practices?: Prisma.PracticeCreateNestedManyWithoutOrganizationInput;

  jobs?: Prisma.JobCreateNestedManyWithoutOrganizationInput;

  reviews?: Prisma.ReviewCreateNestedManyWithoutToOrganizationInput;
}
