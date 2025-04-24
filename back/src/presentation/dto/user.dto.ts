import { ApiProperty } from '@nestjs/swagger';
import { Role, UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  @IsEnum(Role)
  @ApiProperty()
  role: Role;

  @IsOptional()
  @IsJSON()
  @ApiProperty()
  parents?: any;

  @IsEnum(UserType)
  @ApiProperty()
  type: UserType;

  createdAt?: Date; // Дата создания (можно не указывать, если генерируется автоматически)
  updatedAt?: Date; // Дата обновления (можно не указывать, если генерируется автоматически)
}
